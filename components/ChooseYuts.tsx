import { setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import Button from "./Button";
import styles from "./ChooseYuts.module.css";

export default function ChooseYuts({ docRef, color, myYut }) {
  const [chosenYut, setChosenYut] = useState(null);
  console.log("chosenYut: ", chosenYut);
  const key = `chosenYut.${color}`;
  return (
    <>
      <h2>{chosenYut === null && "던질 윷을 선택해주세요."}</h2>
      {/* TODO 사진 inline으로 바꾸기 */}
      {!myYut && (
        <>
          <Image
            style={{ display: "inline" }}
            src="/zeroYuts.png"
            alt="뒤뒤"
            width="64"
            height="64"
            onClick={() => {
              setChosenYut(0);
            }}
            className={chosenYut === 0 && styles.chosenYut}
          />
          <Image
            style={{ display: "inline" }}
            src="/oneYut.png"
            alt="앞뒤"
            width="64"
            height="64"
            onClick={() => {
              setChosenYut(1);
            }}
            className={chosenYut === 1 && styles.chosenYut}
          />
          <Image
            style={{ display: "inline" }}
            src="/twoYuts.png"
            alt="앞앞"
            width="64"
            height="64"
            onClick={() => {
              setChosenYut(2);
            }}
            className={chosenYut === 2 && styles.chosenYut}
          />
          <Button
            type="text"
            className="btn btn-primary"
            ableCondition={chosenYut !== null}
            text="확정"
            onClick={async () => {
              await updateDoc(docRef, {
                [key]: chosenYut,
              });
            }}
          />
        </>
      )}
    </>
  );
}
