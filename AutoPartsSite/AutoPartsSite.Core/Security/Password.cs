using System;
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
    }
}
