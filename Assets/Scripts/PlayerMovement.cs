using UnityEngine;
using UnityEngine.InputSystem;

/// <summary>
/// Third-person player movement for the auditorium scene.
/// Uses Keyboard.current directly — no Input Actions asset needed.
/// Attach to the player root that has a CharacterController component.
/// </summary>
[RequireComponent(typeof(CharacterController))]
public class PlayerMovement : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 2f;
    public float sprintSpeed = 3.5f;
    public float rotationSpeed = 10f;

    [Header("Gravity")]
    public float gravity = -20f;

    [Header("Jump")]
    public float jumpHeight = 1.2f;

    [Header("Camera")]
    [Tooltip("Leave empty to auto-find Camera.main")]
    public Transform cameraTransform;

    [Header("Animation (Optional)")]
    [Tooltip("Assign if you want movement animations")]
    public Animator animator;
    public float animationSmoothTime = 0.1f;

    [Header("Debug")]
    public bool showDebugLogs = true;

    private CharacterController controller;
    private float verticalVelocity = 0f;
    private float currentAnimSpeed = 0f;

    void Start()
    {
        controller = GetComponent<CharacterController>();

        if (cameraTransform == null && Camera.main != null)
        {
            cameraTransform = Camera.main.transform;
        }

        if (controller == null)
        {
            Debug.LogError("[PlayerMovement] No CharacterController found!");
        }

        if (cameraTransform == null)
        {
            Debug.LogError("[PlayerMovement] No camera found!");
        }

        // Force spawn at Y = -116
        Vector3 spawnPos = transform.position;
        spawnPos.y = -116f;
        transform.position = spawnPos;
    }

    void Update()
    {
        if (Keyboard.current == null || controller == null || cameraTransform == null)
            return;

        // --- Ground check using raycast for reliable grounding ---
        bool isGrounded = controller.isGrounded;
        
        // Raycast down to find true ground position and snap to it
        RaycastHit hit;
        float rayLength = 5f;
        if (Physics.Raycast(transform.position + Vector3.up * 0.5f, Vector3.down, out hit, rayLength))
        {
            float distToGround = transform.position.y - hit.point.y;
            
            // If we're floating above ground, snap down
            if (distToGround > 0.05f && distToGround < 3f && verticalVelocity <= 0f)
            {
                Vector3 pos = transform.position;
                pos.y = Mathf.Lerp(pos.y, hit.point.y, 10f * Time.deltaTime);
                transform.position = pos;
                isGrounded = true;
            }
        }

        if (isGrounded && verticalVelocity < 0f)
        {
            verticalVelocity = -2f;
        }

        // --- Read input ---
        float horizontal = 0f;
        float vertical = 0f;

        if (Keyboard.current.wKey.isPressed || Keyboard.current.upArrowKey.isPressed) vertical += 1f;
        if (Keyboard.current.sKey.isPressed || Keyboard.current.downArrowKey.isPressed) vertical -= 1f;
        if (Keyboard.current.dKey.isPressed || Keyboard.current.rightArrowKey.isPressed) horizontal += 1f;
        if (Keyboard.current.aKey.isPressed || Keyboard.current.leftArrowKey.isPressed) horizontal -= 1f;

        Vector3 inputDir = new Vector3(horizontal, 0f, vertical).normalized;
        bool isMoving = inputDir.magnitude >= 0.1f;
        bool isSprinting = Keyboard.current.leftShiftKey.isPressed;

        // --- Calculate movement ---
        Vector3 horizontalMove = Vector3.zero;

        if (isMoving)
        {
            // Get camera-relative directions (flatten to horizontal plane)
            Vector3 camForward = cameraTransform.forward;
            Vector3 camRight = cameraTransform.right;
            camForward.y = 0f;
            camRight.y = 0f;
            camForward.Normalize();
            camRight.Normalize();

            Vector3 moveDirection = (camForward * inputDir.z + camRight * inputDir.x).normalized;

            float speed = isSprinting ? sprintSpeed : moveSpeed;
            horizontalMove = moveDirection * speed;

            // Rotate character to face movement direction
            if (moveDirection != Vector3.zero)
            {
                Quaternion targetRot = Quaternion.LookRotation(moveDirection) * Quaternion.Euler(0f, 180f, 0f);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRot, rotationSpeed * Time.deltaTime);
            }

            if (showDebugLogs)
            {
                Debug.Log($"[PlayerMovement] Moving: dir={moveDirection}, speed={speed}, pos={transform.position}");
            }
        }

        // --- Jump ---
        if (Keyboard.current.spaceKey.wasPressedThisFrame && isGrounded)
        {
            verticalVelocity = Mathf.Sqrt(jumpHeight * -2f * gravity);
        }

        // --- Apply gravity ---
        verticalVelocity += gravity * Time.deltaTime;

        // --- SINGLE Move call combining horizontal + vertical ---
        Vector3 finalMove = horizontalMove + Vector3.up * verticalVelocity;
        controller.Move(finalMove * Time.deltaTime);

        // --- Hardcoded floor clamp: never fall below Y = -116 ---
        if (transform.position.y < -116f)
        {
            Vector3 pos = transform.position;
            pos.y = -116f;
            transform.position = pos;
            verticalVelocity = 0f;
        }

        // --- Animation ---
        float targetAnimSpeed = isMoving ? (isSprinting ? 1f : 0.5f) : 0f;
        currentAnimSpeed = Mathf.MoveTowards(currentAnimSpeed, targetAnimSpeed, Time.deltaTime / animationSmoothTime);
        if (animator != null)
        {
            animator.SetFloat("Speed", currentAnimSpeed);
        }
    }
}
