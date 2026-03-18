using UnityEngine;

public class AvatarSelector : MonoBehaviour
{
    public void SelectAvatar(int avatarID)
    {
        PlayerPrefs.SetInt("Avatar", avatarID);
        PlayerPrefs.Save();
    }
}