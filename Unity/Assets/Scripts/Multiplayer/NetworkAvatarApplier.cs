using Unity.Netcode;
using Unity.Collections;
using UnityEngine;

/// <summary>
/// Syncs avatar customization across the network.
/// Owner serializes AvatarDataStore to a NetworkVariable.
/// Remote players deserialize and apply it so everyone sees custom avatars.
/// </summary>
public class NetworkAvatarApplier : NetworkBehaviour
{
    [Tooltip("Avatar root transform (the 'Idle' object). Auto-found if null.")]
    public Transform avatarRoot;

    // Synced avatar JSON across all clients (owner-write, everyone-read)
    private NetworkVariable<FixedString4096Bytes> networkAvatarJson = new NetworkVariable<FixedString4096Bytes>(
        default, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Owner
    );

    public override void OnNetworkSpawn()
    {
        base.OnNetworkSpawn();
        FindAvatarRoot();

        if (IsOwner)
        {
            // Serialize local avatar data and broadcast to all clients
            if (AvatarDataStore.HasData)
            {
                string json = AvatarDataStore.ToJson();
                networkAvatarJson.Value = new FixedString4096Bytes(json);
                ApplyToRoot(avatarRoot);
                Debug.Log("[NetworkAvatarApplier] Owner: avatar data serialized and applied");
            }
            else
            {
                Debug.LogWarning("[NetworkAvatarApplier] Owner: no avatar data saved — using default appearance");
            }
        }
        else
        {
            // Remote player: apply whatever data the owner already set
            ApplyRemoteAvatar(networkAvatarJson.Value);
        }

        // Listen for changes (handles late-joiners and updates)
        networkAvatarJson.OnValueChanged += OnAvatarJsonChanged;
    }

    public override void OnNetworkDespawn()
    {
        networkAvatarJson.OnValueChanged -= OnAvatarJsonChanged;
    }

    private void OnAvatarJsonChanged(FixedString4096Bytes oldVal, FixedString4096Bytes newVal)
    {
        if (IsOwner) return;
        ApplyRemoteAvatar(newVal);
    }

    // Apply remote avatar data from network JSON
    private void ApplyRemoteAvatar(FixedString4096Bytes data)
    {
        string json = data.ToString();
        if (string.IsNullOrEmpty(json) || avatarRoot == null) return;

        AvatarDataStore.FromJson(json);
        AvatarDataStore.ApplyToAvatar(avatarRoot);
        Debug.Log("[NetworkAvatarApplier] Remote: applied avatar customization from network");
    }

    // Apply local avatar data
    private void ApplyToRoot(Transform root)
    {
        if (root != null && AvatarDataStore.HasData)
            AvatarDataStore.ApplyToAvatar(root);
    }

    private void FindAvatarRoot()
    {
        if (avatarRoot != null) return;

        avatarRoot = transform.Find("Idle");
        if (avatarRoot == null)
        {
            foreach (Transform child in transform)
            {
                if (child.name.StartsWith("Idle"))
                {
                    avatarRoot = child;
                    break;
                }
            }
        }
        if (avatarRoot == null)
        {
            Animator anim = GetComponentInChildren<Animator>();
            if (anim != null) avatarRoot = anim.transform;
        }
    }
}

