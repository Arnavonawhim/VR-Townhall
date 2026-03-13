using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
[RequireComponent(typeof(CapsuleCollider))]
public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    public float walkSpeed = 3f;
    public float runSpeed = 6f;
    public float rotationSpeed = 10f;

    [Header("Jump")]
    public float jumpForce = 5f;
    public float groundCheckDistance = 0.3f;
    public LayerMask groundMask;

    [Header("Animator")]
    public Animator animator;

    private Rigidbody rb;
    private Transform cameraTransform;
    private Vector2 moveInput;
    private bool isGrounded;
    private bool jumpRequested;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.freezeRotation = true;
        rb.interpolation = RigidbodyInterpolation.Interpolate;
        rb.collisionDetectionMode = CollisionDetectionMode.Continuous;
        cameraTransform = Camera.main.transform;

        // Auto-find animator on child if not assigned
        if (animator == null)
            animator = GetComponentInChildren<Animator>();
    }

    void Update()
    {
        moveInput = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));

        // Jump input — only when grounded
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
            jumpRequested = true;

        CheckGround();
        UpdateAnimator();
    }

    void FixedUpdate()
    {
        Move();
        if (jumpRequested)
        {
            rb.linearVelocity = new Vector3(rb.linearVelocity.x, 0f, rb.linearVelocity.z);
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            jumpRequested = false;
        }
    }

    void Move()
    {
        bool isSprinting = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
        float currentSpeed = (moveInput.magnitude > 0.1f && isSprinting) ? runSpeed : walkSpeed;

        if (moveInput.magnitude < 0.1f)
        {
            rb.linearVelocity = new Vector3(0f, rb.linearVelocity.y, 0f);
            return;
        }

        Vector3 camForward = cameraTransform.forward;
        Vector3 camRight   = cameraTransform.right;
        camForward.y = 0f;
        camRight.y   = 0f;
        camForward.Normalize();
        camRight.Normalize();

        Vector3 moveDirection = camForward * moveInput.y + camRight * moveInput.x;

        rb.linearVelocity = new Vector3(
            moveDirection.x * currentSpeed,
            rb.linearVelocity.y,
            moveDirection.z * currentSpeed
        );

        Quaternion targetRotation = Quaternion.LookRotation(moveDirection);
        transform.rotation = Quaternion.Slerp(
            transform.rotation,
            targetRotation,
            rotationSpeed * Time.fixedDeltaTime
        );
    }

    void UpdateAnimator()
    {
        if (animator == null) return;

        bool isSprinting = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);

        float speed = 0f;
        if (moveInput.magnitude > 0.1f)
            speed = isSprinting ? 2f : 1f;  // 0 = idle, 1 = walk, 2 = run

        // Smooth the blend tree transition
        float currentSpeed = animator.GetFloat("Speed");
        float smoothed = Mathf.Lerp(currentSpeed, speed, Time.deltaTime * 8f);
        animator.SetFloat("Speed", smoothed);
    }

    void CheckGround()
    {
        isGrounded = Physics.Raycast(
            transform.position + Vector3.up * 0.1f,
            Vector3.down,
            groundCheckDistance + 0.1f,
            groundMask
        );
    }

    // Visualise ground check in editor
    void OnDrawGizmosSelected()
    {
        Gizmos.color = isGrounded ? Color.green : Color.red;
        Gizmos.DrawLine(
            transform.position + Vector3.up * 0.1f,
            transform.position + Vector3.up * 0.1f + Vector3.down * (groundCheckDistance + 0.1f)
        );
    }
}