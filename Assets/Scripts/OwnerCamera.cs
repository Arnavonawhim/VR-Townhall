using Unity.Netcode;
using UnityEngine;
using Cinemachine;

public class PlayerCameraSetup : NetworkBehaviour
{
    public CinemachineFreeLook freeLook;

    public override void OnNetworkSpawn()
    {
        if (IsOwner)
        {
            freeLook.gameObject.SetActive(true);
        }
        else
        {
            freeLook.gameObject.SetActive(false);
        }
    }
}