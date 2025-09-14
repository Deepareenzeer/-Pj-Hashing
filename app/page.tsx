  "use client";
import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Image from "next/image";
import styles from "./page.module.css";
import {motion} from "framer-motion"




export default function Home() {

  
  return (

    <ReactFullpage
      credits={{ enabled: false }}
      licenseKey={""}
      navigation
      scrollingSpeed={1000}
      
      render={() => {
        return (
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
              <div className={styles.page2}>
                <main className={styles.main2}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className={styles.textContainer2}
                  >
                    <h1 className={styles.title2}>ABOUT</h1>
                    <p className={styles.subtitle2}>
                      Yojifreya is a web application that demonstrates the
                      concepts of linear probing and quadratic probing in hash
                      tables. It provides an interactive interface for users to
                      visualize how these collision resolution techniques work.
                    </p>
                  </motion.div>

                  <div className={styles.img2}>
                    <Image
                      className={styles.php2}
                      src="/ph2.svg"
                      alt="Ph logomark"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </main>
              </div>
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
}
