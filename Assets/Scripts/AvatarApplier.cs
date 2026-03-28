using UnityEngine;

/// <summary>
/// Attach this to the Idle object in the auditorium scene.
/// On Start(), it applies the saved avatar customization from AvatarDataStore.
/// </summary>
public class AvatarApplier : MonoBehaviour
{
    void Start()
    {
        if (AvatarDataStore.HasData)
        {
            AvatarDataStore.ApplyToAvatar(transform);
            Debug.Log("[AvatarApplier] Avatar customization applied from saved data.");
        }
        else
        {
            Debug.LogWarning("[AvatarApplier] No avatar data found. Using default appearance.");
        }
    }
}
