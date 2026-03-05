using UnityEngine;

public class AvatarCustomizer : MonoBehaviour
{
    [Header("Clothes List")]
    public GameObject[] clothes;

    private int currentClothIndex = -1;

    public void SelectCloth(int index)
    {
        if (clothes == null || clothes.Length == 0)
            return;

        if (index < 0 || index >= clothes.Length)
            return;

        if (currentClothIndex == index)
            return;

        // Disable all clothes
        foreach (GameObject cloth in clothes)
        {
            if (cloth != null)
                cloth.SetActive(false);
        }

        // Enable selected cloth
        clothes[index].SetActive(true);

        currentClothIndex = index;
    }
}