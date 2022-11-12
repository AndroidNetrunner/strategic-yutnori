import { useRouter } from "next/router";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
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

function isMovingPhase(thrownYuts) {
  console.log("inMovingPhase:", thrownYuts);
  console.log("test: ", thrownYuts[thrownYuts.length - 1]);
  if (!thrownYuts.length) return false;
  if ([0, 4].includes(thrownYuts[thrownYuts.length - 1])) return false;
  return true;
}

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
    thrownYuts: [],
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
  const {
    turn,
    remainedPieces,
    finishedPieces,
    playingPieces,
    chosenYut,
    thrownYuts,
    isThrowing,
  } = useSelector((state: RootState) => state.game);
  console.log("thrownYuts", thrownYuts);
  const myYut = color === "blue" ? chosenYut.blue : chosenYut.red;
  const opponentYut = color === "blue" ? chosenYut.red : chosenYut.blue;
  console.log("myYut: ", myYut);
  console.log("opponentYut: ", opponentYut);
  const dispatch = useDispatch();
  useEffect(() => {
    unSub();
    onSnapshot(docRef, async (doc) => {
      const {
        turn,
        remainedPieces,
        finishedPieces,
        playingPieces,
        chosenYut,
        possibleMoves,
        thrownYuts,
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
          thrownYuts,
          myColor: color,
        },
      });
      if (chosenYut && chosenYut.red !== null && chosenYut.blue !== null) {
        const result = [...thrownYuts, chosenYut.red + chosenYut.blue];
        await updateDoc(docRef, {
          chosenYut: {
            red: null,
            blue: null,
          },
          thrownYuts: result,
        });
      }
    });
  }, []);
  // TODO:말을 움직일 수 있게 하기
  console.log("thrownYuts: ", thrownYuts);
  return (
    <Container>
      <Turn turn={turn} />{" "}
      {!isMovingPhase(thrownYuts) && (
        <ChooseYuts docRef={docRef} color={color} myYut={myYut} />
      )}{" "}
      {thrownYuts !== null && <ThrownYuts thrownYuts={thrownYuts} />}
      {isMovingPhase(thrownYuts) && (
        <>
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
