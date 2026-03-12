using UnityEngine;

public class SkinColorChanger : MonoBehaviour
{
    [Header("Body Renderer")]
    public SkinnedMeshRenderer bodyRenderer;

    [Header("Material Slot Index For Skin")]
    public int skinMaterialSlot = 0;

    [Header("Skin Materials")]
    public Material[] skinMaterials;

    private int currentSkinIndex = -1;

    public void SelectSkin(int index)
    {
        if (bodyRenderer == null) return;
        if (skinMaterials == null || skinMaterials.Length == 0) return;
        if (index < 0 || index >= skinMaterials.Length) return;
        if (currentSkinIndex == index) return;

        Material[] mats = bodyRenderer.materials;

        if (skinMaterialSlot < 0 || skinMaterialSlot >= mats.Length) return;

        mats[skinMaterialSlot] = skinMaterials[index];
        bodyRenderer.materials = mats;

        currentSkinIndex = index;
    }

    public int GetCurrentSkinIndex()
    {
        return currentSkinIndex;
    }
}