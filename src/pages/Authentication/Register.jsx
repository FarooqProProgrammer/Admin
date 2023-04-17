import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { auth, db, storage } from '../../Config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Text } from '@chakra-ui/react';


export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [images, setImages] = useState();
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                const mountainImagesRef = ref(storage, `AuthImages/${images.name}`);

                await uploadBytes(mountainImagesRef, images).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                });

                await getDownloadURL(ref(storage, mountainImagesRef))
                    .then(async (url) => {
                        console.log(url)

                        await updateProfile(auth.currentUser, {
                        photoURL: url
                        }).then(() => {
                            addDb(url);
                            navigate("/")
                        }).catch((error) => {
                            
                        });
                        
                    })
                    .catch((error) => {
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

            });



    };


    const addDb = async (url) => {
        const docRef = await addDoc(collection(db, "Users"), {
            name: formData.username,
            email: formData.email,
            Profile: url
        });
        console.log("Document written with ID: ", docRef.id);

    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-4 focus:outline-none focus:border-blue-500"
                                placeholder="Username"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaUser className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-4 focus:outline-none focus:border-blue-500"
                                placeholder="Email"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaEnvelope className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-4 focus:outline-none focus:border-blue-500"
                                placeholder="Password"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaLock className="text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Profile Image
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                id="password"
                                onChange={(e) => setImages(e.target.files[0])}
                                className="w-full border border-gray-300 rounded-md py-2 pl-2 pr-4 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Text> If you have and account <Link to="/login">Login</Link> </Text>
                    </div>
                    <Button
                        type="submit"
                        className="w-full  hover:bg-blue-600 text-black font-semibold py-2 px-4 rounded-md transition duration-300"
                    >
                        Register
                    </Button>
                </form>
            </div>
        </div>
    )
}
