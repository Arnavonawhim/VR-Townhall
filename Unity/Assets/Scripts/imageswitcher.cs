using UnityEngine;
using UnityEngine.UI;

public class UIButtonSelector : MonoBehaviour
{
    public Sprite normalSprite;
    public Sprite selectedSprite;

    private static UIButtonSelector currentSelected;
    private Image buttonImage;

    void Start()
    {
        buttonImage = GetComponent<Image>();
        buttonImage.sprite = normalSprite;
    }

    public void SelectButton()
    {
        // Reset previous selected button
        if (currentSelected != null && currentSelected != this)
        {
            currentSelected.ResetButton();
        }

        // Select this button
        buttonImage.sprite = selectedSprite;
        currentSelected = this;
    }

    void ResetButton()
    {
        buttonImage.sprite = normalSprite;
    }
}