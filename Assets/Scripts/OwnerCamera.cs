using Unity.Netcode;
using UnityEngine;
using Cinemachine;
using UnityEngine.InputSystem;

public class PlayerCameraSetup : NetworkBehaviour
{
    public CinemachineFreeLook freeLook;

    public float xSensitivity = 300f;
    public float ySensitivity = 2f;

    public override void OnNetworkSpawn()
    {
        if (IsOwner)
        {
            freeLook.gameObject.SetActive(true);

            // Disable Cinemachine's internal input system
            freeLook.m_XAxis.m_InputAxisName = "";
            freeLook.m_YAxis.m_InputAxisName = "";
        }
        else
        {
            freeLook.gameObject.SetActive(false);
        }
    }

    void Update()
    {
        if (!IsOwner) return;

        if (Mouse.current.rightButton.isPressed)
        {
            Vector2 mouseDelta = Mouse.current.delta.ReadValue();

            freeLook.m_XAxis.Value += mouseDelta.x * xSensitivity * Time.deltaTime;
            freeLook.m_YAxis.Value -= mouseDelta.y * ySensitivity * Time.deltaTime;

            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }
        else
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
    }
}