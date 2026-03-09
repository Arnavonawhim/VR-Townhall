using UnityEngine;

public class SkinColorChanger : MonoBehaviour
{
    [Header("Body Renderer")]
    public SkinnedMeshRenderer bodyRenderer;

    [Header("Skin Materials")]
    public Material[] skinMaterials;

    private int currentSkinIndex = -1;

    public void SelectSkin(int index)
    {
        if (bodyRenderer == null)
            return;

        if (index < 0 || index >= skinMaterials.Length)
            return;

        if (currentSkinIndex == index)
            return;

        // If character has multiple material slots
        Material[] mats = bodyRenderer.materials;

        // Usually body is material slot 0
        mats[0] = skinMaterials[index];

        bodyRenderer.materials = mats;

        currentSkinIndex = index;
    }
}