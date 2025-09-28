"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Image from "next/image";
import styles from "./page.module.css";
import Select from 'react-select';

type Mode = "linear" | "quadratic" | null;

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [isTableInitialized, setIsTableInitialized] = useState(false);
  const [tableSize, setTableSize] = useState<number | null>(null);
  const [hashTable, setHashTable] = useState<(number | "D" | null)[]>([]);
  const [mode, setMode] = useState<Mode>(null);
  const [inputVal, setInputVal] = useState<string>("");
  const [path, setPath] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);
  const options = [
  { value: 'linear', label: 'Linear Probing' },
  { value: 'quadratic', label: 'Quadratic Probing' },
  ];

  const addMessage = (msg: string) => {
    setMessage(msg);
    if(messageTimeout.current){
      clearTimeout(messageTimeout.current);
    }
    messageTimeout.current = setTimeout(() => {
      setMessage(null);
      messageTimeout.current = null;
    }, 4000);
  };
  
  useEffect(() => {
  if (!mode) return; 
  if (!tableSize || tableSize <= 0) return;

  setHashTable(Array(tableSize).fill(null));
  setPath([]);
  addMessage(`Mode changed to ${mode}. Hash table reset.`);
  }, [mode, tableSize]);

  const initTable = () => {
    if (!tableSize || tableSize <= 0) {
      addMessage("Please enter a valid table size");
      return;
    }
    setHashTable(Array(tableSize).fill(null));
    setPath([]);
    setIsTableInitialized(true);
  };

  const resetTable = () => {
    setHashTable([]);
    setPath([]);
    setTableSize(null);
    setInputVal("");
    setMode(null);
    setIsTableInitialized(false);
    addMessage("Hash table reset");
  };

  const hashFunction = (key: number) => {
    const m = tableSize as number;
    return ((key % m) + m) % m;
  };

  const ensureReady = () => {
    if (!tableSize || tableSize <= 0) {
      addMessage("Please enter a valid table size");
      return false;
    }
    if (hashTable.length !== tableSize) {
      setHashTable(Array(tableSize).fill(null));
    }
    return true;
  };

  const insert = () => {
    if (!ensureReady()) return;
    if (!mode) {
      addMessage("Please select a mode");
      return;
    }
    const key = parseInt(inputVal, 10);
    if (isNaN(key)) {
      addMessage("Please enter a valid number");
      return;
    }
    const m = tableSize as number;
    const start = hashFunction(key);
    let i = 0;
    const newPath: number[] = [];
    while (i < m) {
      const probe = mode === "linear" ? (start + i) % m : (start + i * i) % m;
      newPath.push(probe);
      if (hashTable[probe] === null || hashTable[probe] === "D") {
        const newTable = [...hashTable];
        newTable[probe] = key;
        setHashTable(newTable);
        setPath(newPath);
        return;
      }
      i++;
    }
    addMessage("Hash table is full, cannot insert new key");
    setPath(newPath);
  };

  const search = () => {
    if (!ensureReady()) return;
    if (!mode) {
      addMessage("Please select a probing method");
      return;
    }
    const key = parseInt(inputVal, 10);
    if (isNaN(key)) {
      addMessage("Please enter a valid number");
      return;
    }
    const m = tableSize as number;
    const start = hashFunction(key);
    let i = 0;
    const newPath: number[] = [];
    while (i < m) {
      const probe = mode === "linear" ? (start + i) % m : (start + i * i) % m;
      newPath.push(probe);

      if (hashTable[probe] === key) {
        setPath(newPath);
        addMessage(`Key ${key} found at index ${probe}`);
        return;
      } else if (hashTable[probe] === null) {
        setPath(newPath);
        addMessage(`Key ${key} not found`);
        return;
      }
      i++;
    }
    setPath(newPath);
    addMessage(`Key ${key} not found`);
  };

  const remove = () => {
    if (!ensureReady()) return;
    if (!mode) {
      addMessage("Please select a probing method");
      return;
    }
    const key = parseInt(inputVal, 10);
    if (isNaN(key)) {
      addMessage("Please enter a valid number");
      return;
    }
    const m = tableSize as number;
    const start = hashFunction(key);
    let i = 0;
    const newPath: number[] = [];

    while (i < m) {
      const probe = mode === "linear" ? (start + i) % m : (start + i * i) % m;
      newPath.push(probe);
      if (hashTable[probe] === key) {
        const newTable = [...hashTable];
        newTable[probe] = "D";
        setHashTable(newTable);
        setPath(newPath);
        addMessage(`Key ${key} deleted from index ${probe}`);
        return;
      } else if (hashTable[probe] === null) {
        setPath(newPath);
        addMessage(`Key ${key} not found, cannot delete`);
        return;
      }
      i++;
    }
    setPath(newPath);
    addMessage(`Key ${key} not found, cannot delete`);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!hovering) return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [hovering]);

  return (
    <ReactFullpage
      credits={{ enabled: false }}
      licenseKey={""}
      navigation
      scrollingSpeed={1000}
      scrollOverflow={false}
      normalScrollElements="input,button,select,textarea,.scrollBox"
    
      render={() => (
        <ReactFullpage.Wrapper>
          <div className="section">
            <div className={styles.page}>
              <main className={styles.main}>
                <div className={styles.textContainer}>
                  <h1 className={styles.title}>
                    <span className={styles.colorY}>Y</span>
                    <span className={styles.colorOJ}>OJ</span>
                    <span className={styles.colorI}>I</span>
                  </h1>
                  <h1 className={styles.title}>FREYA</h1>
                  <p className={styles.subtitle}>
                    LINEAR PROBING
                    <br />
                    QUADRATIC PROBING
                  </p>
                </div>
                <div className={styles.img}>
                  <Image
                    className={styles.php1}
                    src="/ph.svg"
                    alt="Ph logomark"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </main>
            </div>
          </div>

          <div className="section">
            <div className={styles.page}>
              <main className={styles.main}>
                <div className={styles.img}>
                  <Image
                    className={styles.php2}
                    src="/ph1.svg"
                    alt="Ph logomark"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                  
                </div>
                <div className={styles.textContainer2}>
                  <h1 className={styles.title2}>
                    <span className={styles.colorY}>Y</span>
                    <span className={styles.colorOJ}>OJ</span>
                    <span className={styles.colorI}>IFREYA</span>
                  </h1>
                 
                  <p className={styles.subtitle2}>
                    LINEAR PROBING    QUADRATIC PROBING</p>
                </div>
                <div
                  className={styles.scrollBox}
                  ref={scrollRef}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  
                >
                  <h1 className={styles.scrollBoxTitle}>WHAT IS HASHING</h1>
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>
                  <br />
                  <br />
                  Hashing
                  </p>
                  <p>Hashing คือกระบวนการแปลงข้อมูล (key) ที่มีขนาดใดๆ ให้กลายเป็นค่าตัวเลข (hash value) ที่มีขนาดคงที่ เพื่อใช้เป็นดัชนีในการจัดเก็บหรือเรียกใช้ข้อมูลในตารางแฮช (hash table) อย่างรวดเร็ว 2</p>
                  <br />
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>Collision</p>
                  <p>Collision เกิดขึ้นเมื่อฟังก์ชันแฮช (hash function) สร้างค่าแฮช (hash value) เดียวกันให้กับข้อมูลที่แตกต่างกัน ทำให้ข้อมูลใหม่ไม่สามารถเข้าไปเก็บในตำแหน่งที่ต้องการได้ </p>
                  <br />
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>Linear Probing</p>
                  <p>Linear Probing เป็นวิธีที่ง่ายที่สุดในการจัดการ collision โดยเมื่อเกิดการชนกันของข้อมูล เทคนิคนี้จะมองหาช่องว่างถัดไปในตารางแฮชแบบ เรียงลำดับ หรือ เชิงเส้น (linear) 🚶 </p>
                  <p>1.คำนวณ Hash: คำนวณค่าแฮชของข้อมูลที่ต้องการจัดเก็บ </p>
                  <p>2.ตรวจสอบ: ตรวจสอบว่าตำแหน่งนั้นว่างหรือไม่ </p>
                  <p>3.แก้ Collision: ถ้าตำแหน่งนั้นไม่ว่าง (เกิด collision) ให้ขยับไปดูตำแหน่งถัดไป (index+1,index+2,index+3,...) เรื่อยๆ จนกว่าจะเจอช่องว่าง 🔍 </p>
                  <br />
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>ข้อดี </p>
                  <p>- ง่ายต่อการเข้าใจและนำไปใช้ 2</p>
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>ข้อเสีย </p>
                  <p>- เกิด Primary Clustering: ข้อมูลที่ชนกันจะไปกองรวมกันเป็นกลุ่มใหญ่ๆ ทำให้การค้นหาข้อมูลในภายหลังช้าลงมาก 2</p>
                  <br />
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>Quadratic Probing</p>
                  <p>Quadratic Probing เป็นวิธีที่พัฒนาขึ้นเพื่อแก้ปัญหา Primary Clustering ของ Linear Probing โดยเมื่อเกิดการชนกัน เทคนิคนี้จะขยับไปดูตำแหน่งถัดไปโดยใช้ กำลังสอง (quadratic) 📈  </p>
                  <p>1.คำนวณ Hash: คำนวณค่าแฮชของข้อมูลที่ต้องการจัดเก็บ </p>
                  <p>2.ตรวจสอบ: ตรวจสอบว่าตำแหน่งนั้นว่างหรือไม่ </p>
                  <p>3.แก้ Collision: ถ้าตำแหน่งนั้นไม่ว่าง (เกิด collision) ให้ขยับไปดูตำแหน่งถัดไปโดยใช้การเพิ่มขึ้นแบบกำลังสอง (index+1², index+2², index+3²,...) </p>
                  <br />
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>ข้อดี </p>
                  <p>- ลดปัญหา Primary Clustering: ช่วยกระจายข้อมูลที่ชนกันให้ไม่ไปกองรวมกันเป็นกลุ่มใหญ่ๆ </p>
                  <p style={{ fontSize: "22px", lineHeight: "2",textDecoration: "underline",textDecorationThickness: "1px" }}>ข้อเสีย</p>
                  <p>- เกิด Secondary Clustering: แม้ว่าจะแก้ Primary Clustering ได้ แต่ถ้าข้อมูลหลายตัวมีค่าแฮชเริ่มต้นเหมือนกัน ก็จะเดินไปในเส้นทางเดียวกัน ทำให้เกิดกลุ่มข้อมูลแบบใหม่ได้ (แต่ปัญหาน้อยกว่าแบบแรก) </p>
                </div>
              </main>
            </div>
          </div>

          <div className="section">
            <div className={styles.page}>
              <main className={styles.main}>
                <div className={styles.textContainer3}>
                  <h1 className={styles.title3}>
                    <span className={styles.colorY}>Hashing&nbsp;</span>
                    <span className={styles.colorOJ}>Si</span>
                    <span className={styles.colorI}>mulator</span>
                  </h1>
                  <p className={styles.subtitle3}>
                    LINEAR PROBING &nbsp; QUADRATIC PROBING
                  </p>
                </div>

                <div className={styles.simulatorBox}>
                  <div className={styles.leftPanel}>
                    <section className={styles.frame}>
                      <h2 className={styles.frameTitle}>⚙️ Input Controls</h2>
                      <div>
                        <input
                          className={styles.input}
                          type="number"
                          placeholder="Table Size ( Max 126 )"
                          value={tableSize ?? ""}
                          disabled={isTableInitialized}
                          max={126}
                          onChange={(e) => {
                            const valStr = e.target.value.slice(0, 3);
                            const val = parseInt(valStr, 10);
                            if (isNaN(val)) {
                              setTableSize(null);
                             
                            } else if (val > 126) {
                              setTableSize(126);
                              
                            } else{
                              setTableSize(val);
                            }
                            
                          }}
                        />
                        <button onClick={initTable} className={styles.button}>Init</button>
                        <button onClick={resetTable} className={styles.button}>Reset</button>
                      </div>

                      <div>
                        <Select
                          instanceId="hashing-mode"
                          options={options}
                          value={options.find(o => o.value === mode) || null}
                          onChange={(selected) => setMode(selected?.value as Mode)}
                          isDisabled={!isTableInitialized}
                          placeholder="Select Mode"
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: '#060c2cdd',
                              color: 'white',
                              borderRadius: '6px',
                              border: '1px solid white',
                              fontSize: '20px',
                              padding: '0 8px',         
                              height: '45px',
                              display: 'flex',        
                              alignItems: 'center',    
                            }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: '#060c2cdd',
                              borderRadius: '6px',
                              marginTop: 5,          
                              width: '100%',
                              border: '2px solid white', 
                              overflow: 'hidden',
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isFocused ? '#1a1f4a' : '#060c2c',
                              color: 'white',
                              padding: 10,
                              fontSize: '16px',           
                              textAlign: 'left',          
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: 'white',
                              fontSize: '18px',           
                              textAlign: 'left',
                              
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: '#c0c0c0ff',             
                              fontSize: '16px',
                              paddingRight: '266px'
                            }),
                            container: (base) => ({
                              ...base,
                              alignSelf: 'flex-start',    
                              width: '435px',
                              marginLeft:'4px',
                              marginBottom: '10px',
                              marginTop: '10px', 
                              
                            }),
                          }}
                        />
                      </div>

                      <div>
                        <input
                          className={styles.input}
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter number ( Max 9999 )"
                          value={inputVal}
                          onChange={(e) => {
                            
                            const val = e.target.value.replace(/\D/g, "").slice(0,4);
                            
                            setInputVal(val);
                          }}
                          disabled={!isTableInitialized}
                        />
                        <button onClick={insert} className={styles.button} disabled={!isTableInitialized}>Insert</button>
                        <button onClick={search} className={styles.button} disabled={!isTableInitialized}>Search</button>
                        <button onClick={remove} className={styles.button} disabled={!isTableInitialized}>Delete</button>
                      </div>
                    </section>

                    {/* 🔹 Formula Section */}
                    
                    <section className={styles.frame4}>
                      <h2 className={styles.frameTitle}>📐 Calculation Formula</h2>

                      {(() => {
                        const key = parseInt(inputVal, 10);
                        const m = tableSize ?? null;

                        if (!m || isNaN(key) || !mode) {
                          return (
                            <p>
                              Hash Function: <code>h(k) = k mod TableSize</code>
                              
                            </p>
                          );
                        }

                        const h = ((key % m) + m) % m;
                        const i = path.length > 0 ? path.length - 1 : 0;
                        const result =
                          mode === "linear" ? (h + i) % m : (h + i * i) % m;

                        return (
                          <div>
                            {/* base hash */}
                            <p>
                              Hash Function:&nbsp;
                              <code>
                                h({key}) = ({key} mod {m}) = {h}
                              </code>
                            </p>

                            {/* probing formula */}
                            {mode === "linear" && (
                              <p>
                                Linear Probing:&nbsp;
                                <code>
                                  h({key}, {i}) = ( {h} + {i} ) mod {m} = {result}
                                </code>
                              </p>
                            )}

                            {mode === "quadratic" && (
                              <p>
                                Quadratic Probing:&nbsp;
                                <code>
                                  h({key}, {i}) = ( {h} + {i}² ) mod {m} = {result}
                                </code>
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </section>

                    {/* 🔹 Warning / Messages Section */}
                    <section className={styles.frame3}>
                      <h2 className={styles.frameTitle}>⚠️ Messages Error</h2>
                      {message && (
                        <p style={{margin: "4px 0", fontSize: "18px", color: "rgba(255, 255, 255, 1)"}}>
                          {message}
                        </p>
                      )}
                      {!message && (
                        <p style={{ fontSize: "18px", color: "#666" }}>
                          No messages
                        </p>
                      )}
                      
                    </section>
                  </div>

                  {/* 🔹 Table Section */}
                  <div className={styles.rightPanel}>
                    <section className={styles.frame2}>
                      <h2 className={styles.frameTitle2}>📊 Hash Table</h2>

                      {/* 🔹 Wrapper: fix กรอบไม่ให้ยืด แต่ scroll ได้ */}
                      <div
                        style={{
                          flex: 1,
                          width: "100%",
                          height: "100%",
                          
                        }}
                      >
                        <div
                          className={styles.gridTable}
                          style={{
                            display: "grid",
                            gridAutoFlow: "column",
                            gridTemplateRows: `repeat(9, 50px)`,
                            gap: "6px",
                            marginTop: "10px",
                            marginLeft: "10px",
                            marginRight: "auto",
                            minWidth: "fit-content",   // 🔹 ทำให้ grid กว้างเต็มกรอบเสมอ
                          }}
                        >
                          {hashTable.map((cell, i) => {
                            const isInPath = path.includes(i);
                            const cls =
                              cell === "D"
                                ? styles.deleted
                                : cell !== null
                                ? styles.filled
                                : styles.empty;
                            return (
                              <div
                                key={i}
                                className={`${styles.cell} ${cls} ${isInPath ? styles.path : ""}`}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "2px",
                                    right: "4px",
                                    fontSize: "10px",
                                    color: "#000000ff",
                                  }}
                                >
                                  {i}
                                </div>
                                {cell === "D" ? "D" : cell !== null ? String(cell) : ""}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </main>
            </div>
          </div>

        </ReactFullpage.Wrapper>
      )}
    />
  );
}