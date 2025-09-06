import PropTypes from 'prop-types';
import {useCountdown} from "./useCountdown";

CountdownTimer.propTypes = {
    date: PropTypes.number.isRequired,
    renderer: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired
};

function CountdownTimer({date, renderer, clear}: any) {

    const [days, hours, minutes, seconds, onCompleted] = useCountdown(date, clear);

    return renderer({
        days: days.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }),
        hours: hours.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }),
        minutes: minutes.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }),
        seconds: seconds.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }),
        onCompleted: onCompleted
    });
}

export default CountdownTimer;