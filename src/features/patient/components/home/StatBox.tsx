import styles from './StatBox.module.scss';

// ✅ Definirea tipurilor pentru props
interface StatBoxProps {
    icon: string | JSX.Element; // Acceptă emoji sau componentă React (SVG)
    name: string;
    currentCount: number | string; // Permite atât numere, cât și string-uri
}

const StatBox: React.FC<StatBoxProps> = ({ icon, name, currentCount }) => {
    return (
        <div className={styles.statBox}>
            <div className={styles.firstSec}>
                <p className={styles.statIcon}>{icon}</p>
                <p className={styles.statCont}>{name}</p>
            </div>
            <h2 className={styles.count}>{currentCount}</h2>
        </div>
    );
};

export default StatBox;