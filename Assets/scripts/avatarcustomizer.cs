using UnityEngine;

public class AvatarCustomizer : MonoBehaviour
{
    [Header("Clothes List")]
    public GameObject[] clothes;

    private int currentClothIndex = -1;

    public void SelectCloth(int index)
    {
        if (clothes == null || clothes.Length == 0) return;
        if (index < 0 || index >= clothes.Length) return;
        if (currentClothIndex == index) return;

        for (int i = 0; i < clothes.Length; i++)
        {
            if (clothes[i] != null)
                clothes[i].SetActive(i == index);
        }

        currentClothIndex = index;
    }

    public int GetCurrentClothIndex()
    {
        return currentClothIndex;
    }
}