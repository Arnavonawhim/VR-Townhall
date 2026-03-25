using System;
using System.Collections.Generic;
using Unity.Collections;
using Unity.Netcode;
using UnityEngine;

/// <summary>
/// Syncs avatar customization data across the network.
/// Attach to the Player prefab alongside NetworkObject.
/// Each player's avatar choices (hair, clothes, beard, accessories, shoes, skin)
/// are serialized into a NetworkList so all clients can reconstruct the look.
/// </summary>
public class NetworkAvatarState : NetworkBehaviour
{
    // Format: "category:activeChildName" pairs stored as fixed strings
    private NetworkList<FixedString128Bytes> avatarData;

    // Skin color index synced separately
    private NetworkVariable<int> skinIndex = new NetworkVariable<int>(
        -1, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Owner
    );

    // Category names matching AvatarDataStore
    private static readonly string[] categories = { "hair", "clothes", "beard", "accesories", "shoes" };

    void Awake()
    {
        avatarData = new NetworkList<FixedString128Bytes>();
    }

    public override void OnNetworkSpawn()
    {
        base.OnNetworkSpawn();

        if (IsOwner)
        {
            // Owner pushes their local avatar data to the network
            UploadAvatarData();
        }

        // All clients (including owner) listen for changes and apply them
        avatarData.OnListChanged += OnAvatarDataChanged;
        skinIndex.OnValueChanged += OnSkinIndexChanged;

        // Apply existing data if we spawned after state was set
        if (avatarData.Count > 0)
        {
            ApplyAvatarFromNetwork();
        }
    }

    public override void OnNetworkDespawn()
    {
        avatarData.OnListChanged -= OnAvatarDataChanged;
        skinIndex.OnValueChanged -= OnSkinIndexChanged;
    }

    /// <summary>
    /// Reads local AvatarDataStore and pushes data to network variables.
    /// Called by the owner after spawn.
    /// </summary>
    void UploadAvatarData()
    {
        if (!AvatarDataStore.HasData)
        {
            Debug.LogWarning("[NetworkAvatarState] No local avatar data to upload");
            return;
        }

        avatarData.Clear();

        // Upload category data from AvatarDataStore
        var allData = AvatarDataStore.GetAllData();
        foreach (var kvp in allData)
        {
            string entry = $"{kvp.Key}:{kvp.Value}";
            avatarData.Add(new FixedString128Bytes(entry));
        }

        // Upload skin index
        skinIndex.Value = AvatarDataStore.SkinIndex;

        Debug.Log($"[NetworkAvatarState] Uploaded {avatarData.Count} avatar entries to network");
    }

    void OnAvatarDataChanged(NetworkListEvent<FixedString128Bytes> changeEvent)
    {
        ApplyAvatarFromNetwork();
    }

    void OnSkinIndexChanged(int previousValue, int newValue)
    {
        ApplySkinFromNetwork(newValue);
    }

    /// <summary>
    /// Reconstructs avatar appearance from network data on this player's model.
    /// </summary>
    void ApplyAvatarFromNetwork()
    {
        // Find the avatar root (the "Idle" object) which is a child of this player
        Transform avatarRoot = FindAvatarRoot();
        if (avatarRoot == null)
        {
            Debug.LogWarning("[NetworkAvatarState] Could not find avatar root to apply data");
            return;
        }

        // Parse network data into a dictionary
        Dictionary<string, string> dataDict = new Dictionary<string, string>();
        for (int i = 0; i < avatarData.Count; i++)
        {
            string entry = avatarData[i].ToString();
            int colonIndex = entry.IndexOf(':');
            if (colonIndex > 0)
            {
                string key = entry.Substring(0, colonIndex);
                string value = entry.Substring(colonIndex + 1);
                dataDict[key] = value;
            }
        }

        // Apply category choices (activate correct child, deactivate others)
        foreach (string category in categories)
        {
            Transform categoryTransform = avatarRoot.Find(category);
            if (categoryTransform == null) continue;

            string activeChildName;
            if (dataDict.TryGetValue(category, out activeChildName))
            {
                for (int i = 0; i < categoryTransform.childCount; i++)
                {
                    Transform child = categoryTransform.GetChild(i);
                    child.gameObject.SetActive(child.name == activeChildName);
                }
            }
        }

        // Apply direct children active states (prefixed with "_direct_")
        for (int i = 0; i < avatarRoot.childCount; i++)
        {
            Transform child = avatarRoot.GetChild(i);
            string key = "_direct_" + child.name;
            string value;
            if (dataDict.TryGetValue(key, out value))
            {
                child.gameObject.SetActive(value == "1");
            }
        }

        // Apply skin
        if (skinIndex.Value >= 0)
        {
            ApplySkinFromNetwork(skinIndex.Value);
        }

        Debug.Log($"[NetworkAvatarState] Applied {dataDict.Count} avatar entries from network");
    }

    void ApplySkinFromNetwork(int index)
    {
        if (index < 0) return;

        Transform avatarRoot = FindAvatarRoot();
        if (avatarRoot == null) return;

        SkinColorChanger skinChanger = avatarRoot.GetComponentInChildren<SkinColorChanger>();
        if (skinChanger != null)
        {
            skinChanger.SelectSkin(index);
        }
    }

    /// <summary>
    /// Finds the avatar model root ("Idle" object) under this player.
    /// Searches immediate children for a transform named "Idle".
    /// </summary>
    Transform FindAvatarRoot()
    {
        // Look for direct child named "Idle"
        Transform idle = transform.Find("Idle");
        if (idle != null) return idle;

        // Fallback: search all children
        foreach (Transform child in transform)
        {
            if (child.name.Contains("Idle"))
                return child;
        }

        // Last resort: return the first child with an Animator
        Animator anim = GetComponentInChildren<Animator>();
        if (anim != null) return anim.transform;

        return null;
    }
}
