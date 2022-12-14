import Head from "next/head";
import {
  Container,
  Main,
  Title,
  Description,
} from "../components/sharedstyles";
import Contents from "../components/ContentsRow";
import ContentsRow from "../components/ContentsRow";
import Content from "../components/Content";
import Button from "../components/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import db from "../firebase.config";

const invitationCodeReg = /[A-Z]{5}/;

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const roomsRef = collection(db, "rooms");
  const generateInvitationCode = () => {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += alphabets[Math.floor(Math.random() * 26)];
    }
    return result;
  };
  const handleCreate = async () => {
    const invitationCode = generateInvitationCode();
    await setDoc(doc(db, "rooms", invitationCode), {
      invitationCode,
      admin: nickname,
      guest: null,
      ready: null,
      gameStarted: false,
    });
    router.push(
      {
        pathname: "/room/[invitationCode]",
        query: { invitationCode, nickname, isAdmin: true },
      },
      invitationCode
    );
  };
  const handleEntry = async () => {
    const docRef = doc(roomsRef, invitationCode);
    const roomSnap = await getDoc(docRef);
    if (!roomSnap.exists()) alert("해당하는 방이 존재하지 않습니다.");
    else {
      await updateDoc(docRef, {
        guest: nickname,
      });
      router.push(
        {
          pathname: "/room/[invitationCode]",
          query: { invitationCode },
        },
        invitationCode
      );
    }
  };
  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Title>전략 윷놀이 온라인</Title>
        <Description>
          더 지니어스에 나왔던 그 게임을 회원가입 없이 무료로 즐겨봐요!
        </Description>
        <Contents>
          <ContentsRow>
            <Content>
              <div className="form-group">
                <label htmlFor="nickname">닉네임</label>
                <input
                  type="input"
                  className="form-control"
                  id="nickname"
                  aria-describedby="emailHelp"
                  placeholder="홍길동"
                  value={nickname}
                  onChange={({ target }) => setNickname(target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="invitationCode">
                  초대 코드 (방 생성 시 불필요)
                </label>
                <input
                  type="input"
                  className="form-control"
                  id="invitationCode"
                  placeholder="ABCDE"
                  value={invitationCode}
                  onChange={({ target }) => setInvitationCode(target.value)}
                />
              </div>
              <div className="btn-group">
                <Button
                  type="submit"
                  className="btn btn-primary"
                  ableCondition={nickname && !invitationCode}
                  text="방 생성"
                  onClick={handleCreate}
                />
                <Button
                  type="submit"
                  className="btn btn-success"
                  ableCondition={
                    nickname && invitationCodeReg.test(invitationCode)
                  }
                  text="방 입장"
                  onClick={handleEntry}
                />
              </div>
            </Content>
            <Content>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/X4u0Tfeqvj4"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Description>전략 윷놀이 룰 영상</Description>
            </Content>
          </ContentsRow>
        </Contents>
      </Main>
    </Container>
  );
}
