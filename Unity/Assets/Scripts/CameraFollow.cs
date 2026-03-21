using UnityEngine;

/// <summary>
/// Simple third-person camera that follows the player.
/// Attach to the Main Camera in the auditorium scene.
/// </summary>
public class CameraFollow : MonoBehaviour
{
    [Header("Target")]
    [Tooltip("Drag the player (Idle) object here")]
    public Transform target;

    [Header("Offset")]
    [Tooltip("Camera offset from the player (e.g. 0, 2, -5 = behind and above)")]
    public Vector3 offset = new Vector3(0f, 2f, -5f);

    [Header("Smoothing")]
    public float smoothSpeed = 5f;

    [Header("Look")]
    [Tooltip("How high above the target's feet the camera looks at")]
    public float lookAtHeightOffset = 1f;

    void LateUpdate()
    {
        if (target == null) return;

        // Desired position = player position + offset
        Vector3 desiredPosition = target.position + offset;

        // Smoothly move toward desired position
        transform.position = Vector3.Lerp(transform.position, desiredPosition, smoothSpeed * Time.deltaTime);

        // Always look at the player (offset up a bit so it looks at chest, not feet)
        transform.LookAt(target.position + Vector3.up * lookAtHeightOffset);
    }
}
