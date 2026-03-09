using UnityEngine;

public class UIManager : MonoBehaviour
{
    public GameObject mainPanel;
    public GameObject hairPanel;
    public GameObject clothesPanel;
    public GameObject skinPanel;
    public GameObject shoesPanel;
    public GameObject eyeColorPanel;
    public GameObject moustachePanel;
    public GameObject sunglassesPanel;

    public void OpenHairPanel()
    {
        CloseAllPanels();
        hairPanel.SetActive(true);
    }

    public void OpenClothesPanel()
    {
        CloseAllPanels();
        clothesPanel.SetActive(true);
    }

    public void OpenSkinPanel()
    {
        CloseAllPanels();
        skinPanel.SetActive(true);
    }

    public void OpenShoesPanel()
    {
        CloseAllPanels();
        shoesPanel.SetActive(true);
    }

    public void OpenEyeColorPanel()
    {
        CloseAllPanels();
        eyeColorPanel.SetActive(true);
    }

    public void OpenMoustachePanel()
    {
        CloseAllPanels();
        moustachePanel.SetActive(true);
    }

    public void OpenSunglassesPanel()
    {
        CloseAllPanels();
        sunglassesPanel.SetActive(true);
    }

    public void OpenMainPanel()
    {
        CloseAllPanels();
        mainPanel.SetActive(true);
    }

    void CloseAllPanels()
    {
        mainPanel.SetActive(false);
        hairPanel.SetActive(false);
        clothesPanel.SetActive(false);
        skinPanel.SetActive(false);
        shoesPanel.SetActive(false);
        eyeColorPanel.SetActive(false);
        moustachePanel.SetActive(false);
        sunglassesPanel.SetActive(false);
    }
}