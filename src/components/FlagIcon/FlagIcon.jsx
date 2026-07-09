import styles from './FlagIcon.module.scss';
import ae from 'flag-icons/flags/4x3/ae.svg';
import br from 'flag-icons/flags/4x3/br.svg';
import ch from 'flag-icons/flags/4x3/ch.svg';
import cn from 'flag-icons/flags/4x3/cn.svg';
import de from 'flag-icons/flags/4x3/de.svg';
import eg from 'flag-icons/flags/4x3/eg.svg';
import es from 'flag-icons/flags/4x3/es.svg';
import fr from 'flag-icons/flags/4x3/fr.svg';
import gb from 'flag-icons/flags/4x3/gb.svg';
import ge from 'flag-icons/flags/4x3/ge.svg';
import hu from 'flag-icons/flags/4x3/hu.svg';
import inFlag from 'flag-icons/flags/4x3/in.svg';
import it from 'flag-icons/flags/4x3/it.svg';
import jp from 'flag-icons/flags/4x3/jp.svg';
import kr from 'flag-icons/flags/4x3/kr.svg';
import mv from 'flag-icons/flags/4x3/mv.svg';
import sa from 'flag-icons/flags/4x3/sa.svg';
import tr from 'flag-icons/flags/4x3/tr.svg';
import us from 'flag-icons/flags/4x3/us.svg';
import uz from 'flag-icons/flags/4x3/uz.svg';

// Statically imported (not an external CDN) so flags never depend on a
// network request that an ad-blocker/firewall/DNS filter could block —
// only the handful of countries this site actually uses ship in the bundle.
const FLAGS = { ae, br, ch, cn, de, eg, es, fr, gb, ge, hu, in: inFlag, it, jp, kr, mv, sa, tr, us, uz };

export default function FlagIcon({ iso, className = '', size = 40 }) {
  const src = iso && FLAGS[iso];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      style={{ width: size, height: size * 0.75 }}
      className={`${styles.flag} ${className}`}
    />
  );
}
