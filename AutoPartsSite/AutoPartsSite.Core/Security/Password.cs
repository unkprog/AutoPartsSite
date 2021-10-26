using System;
using System.Linq;
using System.Security;
using System.Security.Cryptography;
using System.Text;

namespace AutoPartsSite.Core.Security
{
    public static class Password
    {
        static string salt = "MTWBSI2021";
        public static string ComputeHash(string input)
        {
            byte[] saltBytes = Encoding.UTF8.GetBytes(salt);
            return ComputeHash(input, new SHA256Managed(), saltBytes);
        }
        public static string ComputeHash(string input, HashAlgorithm algorithm, byte[] salt)
        {
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);

            // Combine salt and input bytes
            byte[] saltedInput = new byte[salt.Length + inputBytes.Length];
            salt.CopyTo(saltedInput, 0);
            inputBytes.CopyTo(saltedInput, salt.Length);

            byte[] hashedBytes = algorithm.ComputeHash(saltedInput);


            StringBuilder hex = new StringBuilder(hashedBytes.Length * 2);
            foreach (byte b in hashedBytes)
                hex.AppendFormat("{0:X2}", b);

            return hex.ToString();

        }

        private static readonly string alphabet = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ01234567899876543210aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
        private static readonly Random r = new Random();

        public const int minPasswordLength = 8;
        public static string Generate(int length)
        {
            if (length < 1 || length > 128)
                throw new ArgumentException("password_length_incorrect", "length");

            var chArray = new char[length];
           
            for (int i = 0; i < length; i++)
            {
                int j = r.Next(alphabet.Length);
                char nextChar = alphabet[j];
                chArray[i] = (nextChar);
            }
            return new string(chArray);
        }

        public static int Check(string password)
        {
            //Let’s start by defining all of the standards for a password.
            int minLength = minPasswordLength;


            //Make boolean so we can use in if statements later on for validation 
            bool containsAtLeastOneUppercase = password.Any(char.IsUpper);
            bool containsAtLeastOneLowercase = password.Any(char.IsLower);
            bool containsAtLeastOneSpecialChar = password.Any(ch => !char.IsLetterOrDigit(ch));
            bool containsAtLeastOneDigit = password.Any(char.IsDigit);

            //Define a variable score to hold their score and set it to 0.
            int score = 0;

            //If the password is greater than or equal to the minimum length, add a point to the score.
            if (password.Length < minLength)
                return 1;

            //If the password contains uppercase letters, add a point.
            //if (Tools.Contains(password, uppercase))
            if (!password.Any(char.IsUpper))
                return 2;

            //If the password contains lowercase letters, add a point.
            //if (Tools.Contains(password, lowercase))
            if (!password.Any(char.IsLower))
                return 3;

            //If the password contains digits, add a point.
            //if (Tools.Contains(password, digits))
            if (!password.Any(char.IsDigit))
                return 4;

            return 0;
        }
    }
}
