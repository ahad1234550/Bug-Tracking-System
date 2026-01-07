import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { Briefcase01Icon, UserIcon } from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from '@hugeicons/react';

export default function Home() {
  return (
    <main>
      <div>
        <Image src="/signup.jpg" width={100} height={100}/>
      </div>
      <div>
        <p>Already have an account? <a href="/signin">SignIn</a></p>
        <div>
          <h3>Join Us!</h3>
          <p>To begin this journey, tell us what type of account you’d be opening.</p>
          <div>
            <div>
              <HugeiconsIcon icon={UserIcon} />
              <h5>Manager</h5>
              <p>Signup as a manager to manage the tasks and bugs</p>
            </div>
            <div>
              <HugeiconsIcon icon={UserIcon} />
              <h5>Developer</h5>
              <p>Signup as a Developer to assign the relevant task to QA</p>
            </div>
            <div>
              <HugeiconsIcon icon={Briefcase01Icon} />
              <h5>QA</h5>
              <p>Signup as a QA to create the bugs and report in tasks</p>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </main>
  );
}
