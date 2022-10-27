import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../../firebase.config.js";
import Button from "../../components/Button";
import { Container } from "../../components/sharedstyles";
import styled from "styled-components";
import ChooseYuts from "../../components/ChooseYuts";
import ThrownYuts from "../../components/ThrownYuts";
import MovingPieces from "../../components/MovingPieces";

async function startGame(docRef) {
  await updateDoc(docRef, {
    turn: {
      color: "blue",
      partner: false,
    },
    remainedPieces: {
      bluePlayer: 2,
      bluePartner: 2,
      redPlayer: 2,
      redPartner: 2,
    },
    finishedPieces: {
      bluePlayer: 0,
      bluePartner: 0,
      redPlayer: 0,
      redPartner: 0,
    },
    playingPieces: {
      bluePlayer: [],
      bluePartner: [],
      redPlayer: [],
      redPartner: [],
    },
    chosenYut: {
      red: null,
      blue: null,
    },
    gameStarted: true,
  });
}

function Preparation({ isAdmin, admin, guest, ready, invitationCode, docRef }) {
  return (
    <div>
      초대 코드: {invitationCode}, 방장: {admin}, 게스트: {guest}, 준비:{" "}
      {ready && "완료!"}
      <Button
        type="text"
        className="btn btn-primary"
        ableCondition={isAdmin && ready}
        text="게임 시작"
        onClick={async () => await startGame(docRef)}
      />
      <Button
        type="text"
        className="btn btn-danger"
        ableCondition={!isAdmin}
        text={ready ? "준비 취소" : "게임 준비"}
        onClick={() => readyGame(docRef, !ready)}
      />
    </div>
  );
}

function Turn({ turn }) {
  return (
    <h1>
      현재 {turn.color === "blue" ? "파랑" : "빨강"}(
      {turn.partner ? "파트너" : "플레이어"})의 차례입니다.
    </h1>
  );
}

function Game({ docRef, color, unSub }) {
  const [turn, setTurn] = useState({
    color: "blue",
    partner: false,
  });
  const [remainedPieces, setRemainedPieces] = useState({
    bluePlayer: 2,
    bluePartner: 2,
    redPlayer: 2,
    redPartner: 2,
  });
  const [finishedPieces, setFinishedPieces] = useState({
    bluePlayer: 0,
    bluePartner: 0,
    redPlayer: 0,
    redPartner: 0,
  });
  const [playingPieces, setPlayingPieces] = useState({
    bluePlayer: [],
    bluePartner: [],
    redPlayer: [],
    redPartner: [],
  });
  const [myYut, setMyYut] = useState(null);
  const [opponentYut, setOpponentYut] = useState(null);

  useEffect(() => {
    unSub();
    onSnapshot(docRef, (doc) => {
      const { turn, remainedPieces, finishedPieces, playingPieces, chosenYut } =
        doc.data();
      setTurn(turn);
      setRemainedPieces(remainedPieces);
      setFinishedPieces(finishedPieces);
      setPlayingPieces(playingPieces);
      setMyYut(chosenYut[color === "red" ? "red" : "blue"]);
      setOpponentYut(chosenYut[color === "red" ? "blue" : "red"]);
    });
  }, []);

  // TODO:말을 움직일 수 있게 하기
  return (
    <Container>
      <Turn turn={turn} />{" "}
      {myYut === null && <ChooseYuts docRef={docRef} color={color} />}{" "}
      {myYut !== null && opponentYut !== null && (
        <>
          <ThrownYuts myYut={myYut} opponentYut={opponentYut} />
          <MovingPieces
            myTurn={turn.color === color}
            color={color}
            remainedPieces={remainedPieces}
          />
        </>
      )}
      <Map />
    </Container>
  );
}

const readyGame = async (docRef, ready) => {
  await updateDoc(docRef, {
    ready,
  });
};

export default function Room() {
  const router = useRouter();
  const { invitationCode, nickname, isAdmin } = router.query;
  const [admin, setAdmin] = useState(nickname);
  const [guest, setGuest] = useState(null);
  const [ready, setReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  if (typeof invitationCode !== "string") return;
  const docRef = doc(db, "rooms", invitationCode);
  const unSub = onSnapshot(docRef, (doc) => {
    const { admin, guest, ready, gameStarted } = doc.data();
    setAdmin(admin);
    setGuest(guest);
    setReady(ready);
    setGameStarted(gameStarted);
  });
  return gameStarted ? (
    <Game docRef={docRef} color={isAdmin ? "blue" : "red"} unSub={unSub} />
  ) : (
    <Preparation
      isAdmin={isAdmin}
      admin={admin}
      guest={guest}
      ready={ready}
      invitationCode={invitationCode}
      docRef={docRef}
    />
  );
}

function Map() {
  return (
    <StyledTable>
      <tr>
        <td>
          <BigCircle />
        </td>
        <td colSpan={5}>
          <HorizontalCircle />
          <HorizontalCircle />
          <HorizontalCircle />
          <HorizontalCircle />
        </td>
        <td>
          <BigCircle />
        </td>
      </tr>
      <tr>
        <td rowSpan={5}>
          <VerticalCircle />
          <VerticalCircle />
          <VerticalCircle />
          <VerticalCircle />
        </td>
        <td>
          <SmallCircle />
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <SmallCircle />
        </td>
        <td rowSpan={5}>
          <VerticalCircle />
          <VerticalCircle />
          <VerticalCircle />
          <VerticalCircle />
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <SmallCircle />
        </td>
        <td></td>
        <td>
          <SmallCircle />
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>
          <BigCircle />
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>
          <SmallCircle />
        </td>
        <td></td>
        <td>
          <SmallCircle />
        </td>
      </tr>
      <tr>
        <td>
          <SmallCircle />
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <SmallCircle />
        </td>
        <td></td>
      </tr>
      <tr>
        <td>
          <BigCircle />
        </td>
        <td colSpan={5}>
          <HorizontalCircle />
          <HorizontalCircle />
          <HorizontalCircle />
          <HorizontalCircle />
        </td>
        <td>
          <BigCircle />
        </td>
      </tr>
    </StyledTable>
  );
}

const StyledTable = styled.table`
  border-collapse: separate;
  empty-cells: show;
`;

const BigCircle = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid;
  border-radius: 100%;
  margin: 0 0.5rem 0 0.5rem;
`;

const SmallCircle = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid;
  border-radius: 100%;
  margin: 2rem;
  display: inline-block;
`;

const HorizontalCircle = styled(SmallCircle)`
  margin-left: 3.2rem;
  margin-right: 3.2rem;
`;
const VerticalCircle = styled(SmallCircle)`
  margin-top: 5rem;
  margin-bottom: 5rem;
  display: block;
`;
