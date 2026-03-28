using UnityEngine;
using UnityEngine.SceneManagement;
using System.Runtime.InteropServices;

/// <summary>
/// Main entry point from React for room-based multiplayer.
/// Attach to a DontDestroyOnLoad GameObject named "RoomBootstrapper".
/// React calls CreateRoom or JoinRoom via sendMessage with a JSON payload.
/// </summary>
public class RoomBootstrapper : MonoBehaviour
{
    private static RoomBootstrapper instance;

    [DllImport("__Internal")]
    private static extern void NotifyRelayCode(string code);

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    [System.Serializable]
    private class RoomPayload
    {
        public string roomId;
        public string type;
        public bool isHost;
        public string relayJoinCode;
        public string avatarJson;
    }

    /// <summary>
    /// Called by React when the user creates a room (they are the host).
    /// Hydrates avatar, loads the correct scene, then creates a Relay allocation.
    /// </summary>
    public async void CreateRoom(string json)
    {
        Debug.Log($"[RoomBootstrapper] CreateRoom called. JSON: {json}");
        var payload = JsonUtility.FromJson<RoomPayload>(json);

        HydrateAvatar(payload.avatarJson);
        string sceneName = GetSceneName(payload.type);

        SceneManager.LoadScene(sceneName);
        // Wait for scene to load before starting relay
        SceneManager.sceneLoaded += async (scene, loadMode) =>
        {
            if (scene.name != sceneName) return;
            SceneManager.sceneLoaded -= null; // Unsubscribe

            // Give the scene a frame to initialize NetworkManager
            await System.Threading.Tasks.Task.Delay(500);

            if (RelayManager.Instance != null)
            {
                string joinCode = await RelayManager.Instance.CreateRelay();
                Debug.Log($"[RoomBootstrapper] Relay created. Code: {joinCode}");

#if UNITY_WEBGL && !UNITY_EDITOR
                NotifyRelayCode(joinCode);
#endif
            }
            else
            {
                Debug.LogError("[RoomBootstrapper] RelayManager not found in scene!");
            }
        };
    }

    /// <summary>
    /// Called by React when the user joins an existing room.
    /// Hydrates avatar, loads the correct scene, then joins the Relay.
    /// </summary>
    public void JoinRoom(string json)
    {
        Debug.Log($"[RoomBootstrapper] JoinRoom called. JSON: {json}");
        var payload = JsonUtility.FromJson<RoomPayload>(json);

        HydrateAvatar(payload.avatarJson);
        string sceneName = GetSceneName(payload.type);
        string relayCode = payload.relayJoinCode;

        SceneManager.LoadScene(sceneName);
        SceneManager.sceneLoaded += async (scene, loadMode) =>
        {
            if (scene.name != sceneName) return;

            await System.Threading.Tasks.Task.Delay(500);

            if (RelayManager.Instance != null && !string.IsNullOrEmpty(relayCode))
            {
                bool success = await RelayManager.Instance.JoinRelay(relayCode);
                Debug.Log($"[RoomBootstrapper] Join relay result: {success}");
            }
            else
            {
                Debug.LogError("[RoomBootstrapper] RelayManager not found or missing join code!");
            }
        };
    }

    /// <summary>
    /// Called by React when user leaves a room. Disconnects relay and loads dashboard scene.
    /// </summary>
    public void LeaveRoom()
    {
        Debug.Log("[RoomBootstrapper] LeaveRoom called");
        if (RelayManager.Instance != null)
            RelayManager.Instance.Disconnect();

        SceneManager.LoadScene("DashboardAvatarScene");
    }

    // Hydrate AvatarDataStore from the JSON sent by React
    private void HydrateAvatar(string avatarJson)
    {
        if (!string.IsNullOrEmpty(avatarJson))
        {
            AvatarDataStore.FromJson(avatarJson);
            Debug.Log("[RoomBootstrapper] Avatar data hydrated from React");
        }
    }

    // Map room type string to Unity scene name
    private string GetSceneName(string roomType)
    {
        switch (roomType)
        {
            case "auditorium": return "auditorium";
            case "classroom": return "Classroom";
            case "big_auditorium": return "BigAuditorium";
            default:
                Debug.LogWarning($"[RoomBootstrapper] Unknown room type '{roomType}', defaulting to auditorium");
                return "auditorium";
        }
    }
}
