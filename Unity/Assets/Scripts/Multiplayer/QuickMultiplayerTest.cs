using UnityEngine;
using TMPro;

/// <summary>
/// Quick multiplayer test script. Press H to host, J to join.
/// Displays relay code on screen so you can copy it.
/// DELETE THIS SCRIPT after testing — it's only for dev.
/// </summary>
public class QuickMultiplayerTest : MonoBehaviour
{
    private string joinCode = "";
    private string status = "Press H to Host, J to Join";
    private string inputCode = "";
    private bool waitingForCode = false;

    void OnGUI()
    {
        GUIStyle boxStyle = new GUIStyle(GUI.skin.box) { fontSize = 18 };
        GUIStyle labelStyle = new GUIStyle(GUI.skin.label) { fontSize = 16, fontStyle = FontStyle.Bold };
        GUIStyle inputStyle = new GUIStyle(GUI.skin.textField) { fontSize = 18 };
        GUIStyle buttonStyle = new GUIStyle(GUI.skin.button) { fontSize = 16 };

        GUI.Box(new Rect(10, 10, 400, 180), "Multiplayer Test", boxStyle);
        GUI.Label(new Rect(20, 40, 380, 30), status, labelStyle);

        if (!string.IsNullOrEmpty(joinCode))
        {
            GUI.Label(new Rect(20, 70, 380, 30), $"Join Code: {joinCode}", labelStyle);
        }

        if (waitingForCode)
        {
            GUI.Label(new Rect(20, 70, 380, 25), "Enter join code:", labelStyle);
            inputCode = GUI.TextField(new Rect(20, 100, 260, 30), inputCode, inputStyle);
            if (GUI.Button(new Rect(290, 100, 100, 30), "Connect", buttonStyle))
            {
                JoinRelay();
            }
        }

        if (!waitingForCode && string.IsNullOrEmpty(joinCode))
        {
            if (GUI.Button(new Rect(20, 110, 180, 35), "Host (H)", buttonStyle))
                HostRelay();
            if (GUI.Button(new Rect(210, 110, 180, 35), "Join (J)", buttonStyle))
                waitingForCode = true;
        }
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.H) && string.IsNullOrEmpty(joinCode))
            HostRelay();
        if (Input.GetKeyDown(KeyCode.J) && string.IsNullOrEmpty(joinCode))
            waitingForCode = true;
    }

    async void HostRelay()
    {
        status = "Creating relay...";
        if (RelayManager.Instance == null) { status = "ERROR: No RelayManager in scene!"; return; }

        string code = await RelayManager.Instance.CreateRelay();
        if (code != null)
        {
            joinCode = code;
            status = $"HOSTING! Share this code:";
            Debug.Log($"=== JOIN CODE: {code} ===");
        }
        else
        {
            status = "Failed to create relay.";
        }
    }

    async void JoinRelay()
    {
        string code = inputCode.Trim().ToUpper();
        if (string.IsNullOrEmpty(code)) return;

        status = $"Joining {code}...";
        waitingForCode = false;

        if (RelayManager.Instance == null) { status = "ERROR: No RelayManager in scene!"; return; }

        bool ok = await RelayManager.Instance.JoinRelay(code);
        if (ok)
        {
            joinCode = code;
            status = "CONNECTED as client!";
        }
        else
        {
            status = "Failed to join. Check the code.";
        }
    }
}
