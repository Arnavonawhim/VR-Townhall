using Unity.Netcode;
using UnityEngine;

public class HostAvatarSpawner : NetworkBehaviour
{
    public GameObject avatarPrefab;

    public override void OnNetworkSpawn()
    {
        if (IsServer) // Host is also server
        {
            GameObject avatar = Instantiate(avatarPrefab);
            avatar.GetComponent<NetworkObject>().Spawn();
        }
    }
}