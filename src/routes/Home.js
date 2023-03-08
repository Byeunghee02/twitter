import { dbService } from "fBase";
import { addDoc, collection,  onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Tweet from "../components/Tweet"

const Home = ({userObj}) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  useEffect(()=>{
    onSnapshot(collection(dbService,"tweets"),(snapshot)=>{
      const tweetArray = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
    
  },[]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setTweet("");
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
          value={tweet}
        />
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map((tweet)=>(
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={userObj.uid === tweet.creatorId}></Tweet>
        ))}
      </div>
    </div>
  );
};
export default Home;
