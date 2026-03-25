using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Saves avatar customization state and loads SpawnArea scene.
/// Attach to a GameObject in the avatar customization scene.
/// Wire the "Done" button to LoadSpawnArea().
/// </summary>
public class SceneLoader : MonoBehaviour
{
    [Tooltip("The root Idle transform of the avatar being customized. If null, auto-searches the scene.")]
    public Transform idleTransform;

    /// <summary>
    /// Called by the Done button — saves avatar data then loads SpawnArea.
    /// </summary>
    public void LoadSpawnArea()
    {
        // Auto-find the Idle transform if not assigned in Inspector
        if (idleTransform == null)
        {
            // Search for an object named "Idle" or containing "Idle" in the scene
            GameObject[] roots = SceneManager.GetActiveScene().GetRootGameObjects();
            foreach (GameObject root in roots)
            {
                Transform found = FindIdleRecursive(root.transform);
                if (found != null)
                {
                    idleTransform = found;
                    break;
                }
            }
        }

        if (idleTransform != null)
        {
            AvatarDataStore.SaveFromAvatar(idleTransform);
            Debug.Log("[SceneLoader] Avatar data saved, loading SpawnArea...");
        }
        else
        {
            Debug.LogWarning("[SceneLoader] Could not find Idle transform — avatar data not saved!");
        }

        SceneManager.LoadScene("SpawnArea");
    }

    /// <summary>
    /// Backwards-compatible method — redirects to LoadSpawnArea.
    /// </summary>
    public void LoadSceneOne()
    {
        LoadSpawnArea();
    }

    Transform FindIdleRecursive(Transform parent)
    {
        if (parent.name.StartsWith("Idle"))
            return parent;

        foreach (Transform child in parent)
        {
            Transform result = FindIdleRecursive(child);
            if (result != null) return result;
        }
        return null;
    }
}