import React, { useEffect, useState, useRef } from "react";
import { authService, dbService, storageService } from "../fBase";
import { useNavigate } from "react-router-dom";
import { signOut, updateProfile } from "firebase/auth";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  const fileInput = useRef();
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    //Todo: 현재 프로필 사진 불러오기, 사진 없이 이름만 변경할 경우 오류 수정
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "") {
      try {
        await deleteObject(ref(storageService, userObj.photoURL));
      } catch (error) {
        console.log(error);
      }
      const attachmentRef = ref(
        storageService,
        `${userObj.uid}/profilePhoto/${uuidv4()}`
      );
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    if (attachmentURL !== "") {
      await updateProfile(authService.currentUser, {
        photoURL: attachmentURL,
      });
    }
    refreshUser();
    onClearAttachment();
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = null;
  };
  useEffect(() => {
    getMyTweets();
  }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={newDisplayName}
          placeholder="Display name"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Update profile" />
        {attachment && (
          <div>
            <img src={attachment} alt="preview" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
