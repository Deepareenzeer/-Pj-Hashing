"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Image from "next/image";
import Select from "react-select";
import styles from "./page.module.css";
import "./globals.css";

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
  const [freeInputMode, setFreeInputMode] = useState(false);

  
  
  const [tableSizeInput, setTableSizeInput] = useState("");
  const options = [
    { value: "linear", label: "Linear Probing" },
    { value: "quadratic", label: "Quadratic Probing" },
  ];

  const addMessage = (msg: string) => {
    setMessage(msg);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => {
      setMessage(null);
      messageTimeout.current = null;
    }, 4000);
  };

  const isValidKey = (val: string) => {
    if (!val) return false;

    if (!freeInputMode) {
      
      return /^-?[1-9]\d*$/.test(val) || val === "0";
    } else {
      
      return /^-?[1-9]\d*$/.test(val) || val === "0";
    }
  };

  useEffect(() => {
    if (!mode || !tableSize) return;
    setHashTable(Array(Math.abs(tableSize)).fill(null)); 
    setPath([]);
    addMessage(`Mode changed to ${mode}. Hash table reset.`);
  }, [mode, tableSize]);

  const initTable = () => {
    const val = tableSizeInput.trim();

    if (freeInputMode) {
      const hasHyphen = val.startsWith('-');
      
      if ((hasHyphen && val.length > 4) || (!hasHyphen && val.length > 3)) {
        addMessage("Table size cannot exceed 3 digits (or 4 with a sign).");
        return;
      }
    }

    if (!isValidKey(val)) {
      addMessage("Table size must be a valid number (no letters, no leading 0s)");
      return;
    }

    const size = parseInt(val, 10);
    if (size === 0) {
      addMessage("Table size cannot be zero");
      return;
    }
    if (Math.abs(size) > 126) {
      addMessage("Absolute table size cannot exceed 126");
      return;
    }

    setTableSize(size);
    setHashTable(Array(Math.abs(size)).fill(null)); // แฮชเทเบิลใช้ขนาดบวก
    setPath([]);
    setIsTableInitialized(true);
    addMessage(`Table initialized with size ${size}`);
  };

  const resetTable = () => {
    setHashTable([]);
    setPath([]);
    setTableSize(null);
    setTableSizeInput("");
    setInputVal("");
    setMode(null);
    setIsTableInitialized(false);
    addMessage("Hash table reset");
  };

  const hashFunction = (key: number) => {
    const m = Math.abs(tableSize as number); 
    return ((key % m) + m) % m;
  };

  const ensureReady = () => {
    
    if (!tableSize) { 
      addMessage("Please initialize the table with a valid size");
      return false;
    }
    
    if (hashTable.length !== Math.abs(tableSize)) {
      setHashTable(Array(Math.abs(tableSize)).fill(null));
    }
    return true;
  };

  const insert = () => {
    if (!ensureReady() || !mode || !isValidKey(inputVal)) {
      addMessage("Invalid input or mode not selected!");
      return;
    }

    if (!isValidKey(inputVal)) {
      addMessage("Input must be a valid positive or negative number (no 01, A1 etc.)");
      return;
    }

    

    const key = parseInt(inputVal, 10);
    const m = Math.abs(tableSize as number); 
    const start = hashFunction(key);
    let i = 0;
    const newPath: number[] = [];

    if (Math.abs(key) > 99999) {
      addMessage("Input number cannot exceed 5 digits (-99999 to 99999).");
      return;
    }

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
    if (!ensureReady() || !mode || !isValidKey(inputVal)) {
      addMessage("Invalid input or mode not selected!");
      return;
    }

    if (!isValidKey(inputVal)) {
      addMessage("Input must be a valid positive or negative number (no 01, A1 etc.)");
      return;
    }

    const key = parseInt(inputVal, 10);
    const m = Math.abs(tableSize as number); 
    const start = hashFunction(key);
    let i = 0;
    const newPath: number[] = [];

    if (Math.abs(key) > 99999) {
      addMessage("Input number cannot exceed 5 digits (-99999 to 99999).");
      return;
    }

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
    if (!ensureReady() || !mode || !isValidKey(inputVal)) {
      addMessage("Invalid input or mode not selected!");
      return;
    }
    if (!isValidKey(inputVal)) {
      addMessage("Input must be a valid positive or negative number (no 01, A1 etc.)");
      return;
    }

    const key = parseInt(inputVal, 10);
    const m = Math.abs(tableSize as number); 
    const start = hashFunction(key);
    let i = 0;
    const newPath: number[] = [];

    if (Math.abs(key) > 99999) {
      addMessage("Input number cannot exceed 5 digits (-99999 to 99999).");
      return;
    }

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

 
  useEffect(() => {
   
    if (path.length > 0) {
      const timer = setTimeout(() => {
        setPath([]); // Clear the path after 2 seconds.
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [path]); 

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
                      <div className={styles.toggleWrapper}>
                        
                        <div
                          className={`${styles.toggleSwitch} ${freeInputMode ? styles.on : ""}`}
                          onClick={() => {
                            setFreeInputMode(!freeInputMode);
                            addMessage(
                              !freeInputMode
                                ? "Free Input Mode enabled — You can type any characters."
                                : "Free Input Mode disabled — Only numbers allowed."
                            );
                            setHashTable([]);
                            setPath([]);
                            setTableSize(null);
                            setTableSizeInput("");
                            setInputVal("");
                            setMode(null);
                            setIsTableInitialized(false);
                          
                            
                          }}
                        >
                          <div className={styles.toggleCircle}></div>
                        </div>
                      </div>
                      <div>
                        <input
                          className={styles.input}
                          type="text"
                          placeholder="Table Size (Max 126)"
                          value={tableSizeInput}
                          disabled={isTableInitialized}
                          onKeyDown={(e) => {
                            const allowedKeys = ["Backspace","ArrowLeft","ArrowRight","Delete","Tab"];
                            if (!freeInputMode) {
                              // - เฉพาะตัวแรก
                              if (e.key === "-" && tableSizeInput.length !== 0) e.preventDefault();
                              // อนุญาตแค่ตัวเลข, -, control keys
                              if (!/[0-9]/.test(e.key) && e.key !== "-" && !allowedKeys.includes(e.key)) e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!freeInputMode) {
                              val = val.replace(/[^0-9-]/g, ""); // ลบตัวอักษร
                              val = val.replace(/^(-?)0+(\d)/, "$1$2"); // ลบ leading zeros
                              val = val.slice(0, 3); // max 3 หลัก สำหรับ table size
                            }
                            setTableSizeInput(val);
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
                          isSearchable={false}
                          placeholder="Select Mode"
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: '#060c2cdd',
                              height: 'clamp(35px, 4vw, 45px)', 
                              borderRadius: '6px', 
                              fontSize: 'clamp(14px, 1.2vw, 20px)', 
                              padding: '0 8px',
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
                              fontSize: 'clamp(14px, 1vw, 16px)',           
                              textAlign: 'left',          
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: 'white',
                              fontSize: 'clamp(16px, 1.2vw, 18px)',           
                              textAlign: 'left',
                              
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: '#c0c0c0ff',             
                              fontSize: 'clamp(14px, 1vw, 16px)',
                              paddingRight: '75%',
                            }),
                            container: (base) => ({
                                ...base,
                                width: '100%',      
                                maxWidth: '533px',  
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
                          placeholder="Enter number (Max 99999)"
                          value={inputVal}
                          onKeyDown={(e) => {
                            const allowedKeys = ["Backspace","ArrowLeft","ArrowRight","Delete","Tab"];
                            if (!freeInputMode) {
                              if (e.key === "-" && inputVal.length !== 0) e.preventDefault();
                              if (!/[0-9]/.test(e.key) && e.key !== "-" && !allowedKeys.includes(e.key)) e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            let val = e.target.value;

                            if (!freeInputMode) {
                              val = val.replace(/[^0-9-]/g, "");
                              val = val.replace(/^(-?)0+(\d)/, "$1$2"); // ลบเลขนำหน้า 0
                              val = val.slice(0,5); // max 4 หลัก + -
                            }

                            setInputVal(val);
                          }}
                          disabled={!isTableInitialized}
                        />
                        <button onClick={insert} className={styles.button} disabled={!isTableInitialized}>Insert</button>
                        <button onClick={search} className={styles.button} disabled={!isTableInitialized}>Search</button>
                        <button onClick={remove} className={styles.button} disabled={!isTableInitialized}>Delete</button>
                      </div>
                    </section>
                 
                    <section className={styles.frame4}>
                      <h2 className={styles.frameTitle}>📐 Calculation Formula</h2>

                      {(() => {
                        const key = parseInt(inputVal, 10);
                        const m = tableSize ? Math.abs(tableSize) : null;

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
                            <p>
                              Hash Function:&nbsp;
                              <code>
                                h({key}) = ({key} mod {m}) = {h}
                              </code>
                            </p>

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

                  <div className={styles.rightPanel}>
                    <section className={styles.frame2}>
                      <h2 className={styles.frameTitle2}>📊 Hash Table</h2>

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
                            maxWidth: "100%",   
                            overflowX: "auto", 
                            padding: "5px",
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