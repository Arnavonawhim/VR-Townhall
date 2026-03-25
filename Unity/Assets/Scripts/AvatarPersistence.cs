using UnityEngine;

/// <summary>
/// Legacy avatar persistence — no longer uses DontDestroyOnLoad since
/// NetworkManager handles player spawning in multiplayer scenes.
/// Avatar data is stored in the static AvatarDataStore which persists between scenes.
/// This script is kept for backwards compatibility but is no longer needed.
/// </summary>
public class AvatarPersistence : MonoBehaviour
{
    public static AvatarPersistence Instance;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        // DontDestroyOnLoad removed — conflicts with NetworkManager player spawning.
        // Avatar data is now stored in static AvatarDataStore.
    }
}