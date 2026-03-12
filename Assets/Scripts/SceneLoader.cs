using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneLoader : MonoBehaviour
{
    public int sceneIndex = 1;

    public void LoadSceneByIndex()
    {
        SceneManager.LoadScene(sceneIndex);
    }
}