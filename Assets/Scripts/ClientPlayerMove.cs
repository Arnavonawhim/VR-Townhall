using System;
using Unity.Netcode;
using UnityEngine;
using UnityEngine.InputSystem;
using StarterAssets;

public class ClientPlayerMove : NetworkBehaviour
{
    private PlayerInput m_PlayerInput;
    //[SerializeField] private StarterAssetsInputs m_StarterAssetsInputs;
    private BasicThirdPersonMovement m_ThirdPersonController;

    private void Awake()
    {
        m_PlayerInput = GetComponent<PlayerInput>();
        m_ThirdPersonController = GetComponent<BasicThirdPersonMovement>();
        //m_StarterAssetsInputs.enabled = false;
        m_PlayerInput.enabled = false;
        m_ThirdPersonController.enabled = false;
    }

    public override void OnNetworkSpawn()
    {
        base.OnNetworkSpawn();

        if (IsOwner)
        {
            //m_StarterAssetsInputs.enabled = true;
            m_PlayerInput.enabled = true;
            m_ThirdPersonController.enabled = true;
        }
    }
}