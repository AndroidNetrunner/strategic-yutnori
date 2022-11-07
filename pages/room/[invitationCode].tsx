import { useRouter } from "next/router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../../firebase.config.js";
import Button from "../../components/Button";
import { Container } from "../../components/sharedstyles";
import { useDispatch, useSelector } from "react-redux";
import ChooseYuts from "../../components/ChooseYuts";
import ThrownYuts from "../../components/ThrownYuts";
import MovingPieces from "../../components/MovingPieces";
import Map from "../../components/Map";
import { RootState } from "../../store/index";

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
  console.log("admin", admin);
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
  const { turn, remainedPieces, finishedPieces, playingPieces, chosenYut } =
    useSelector((state: RootState) => state.game);
  const myYut = color === "blue" ? chosenYut.blue : chosenYut.red;
  const opponentYut = color === "blue" ? chosenYut.red : chosenYut.blue;
  console.log("myYut: ", myYut);
  console.log("opponentYut: ", opponentYut);
  const dispatch = useDispatch();
  useEffect(() => {
    unSub();
    onSnapshot(docRef, (doc) => {
      const {
        turn,
        remainedPieces,
        finishedPieces,
        playingPieces,
        chosenYut,
        possibleMoves,
      } = doc.data();
      dispatch({
        type: "game/updateGame",
        payload: {
          turn,
          remainedPieces,
          finishedPieces,
          playingPieces,
          chosenYut,
          possibleMoves,
        },
      });
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
  const dispatch = useDispatch();
  const { admin, guest, ready, gameStarted } = useSelector(
    (state: RootState) => state.room
  );
  if (typeof invitationCode !== "string") return;
  const docRef = doc(db, "rooms", invitationCode);
  const unSub = onSnapshot(docRef, (doc) => {
    const { admin, guest, ready, gameStarted } = doc.data();
    dispatch({
      type: "room/updateRoom",
      payload: {
        admin,
        guest,
        gameStarted,
        ready,
        invitationCode,
      },
    });
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
