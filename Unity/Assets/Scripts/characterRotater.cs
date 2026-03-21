using UnityEngine;

public class CharacterRotate : MonoBehaviour
{
    public Transform character;   // your 3D model
    public float rotationAmount = 30f;

    public void RotateRight()
    {
        character.Rotate(0, rotationAmount, 0);
    }

    public void RotateLeft()
    {
        character.Rotate(0, -rotationAmount, 0);
    }
}
