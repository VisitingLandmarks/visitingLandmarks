const degToRad = Math.PI / 180; // Degree-to-Radian conversion
const radToDeg = 180 / Math.PI; // Radian-to-Degree conversion


/**
 * translate geometrical device orieantation into a magnetical north orientation
 * simply, a direction pointer
 * @param alpha
 * @param beta
 * @param gamma
 */
export default module.exports = (alpha, beta, gamma) => {

    const _x = beta ? beta * degToRad : 0; // beta value
    const _y = gamma ? gamma * degToRad : 0; // gamma value
    const _z = alpha ? alpha * degToRad : 0; // alpha value

    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);
    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    let compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    // Compass Heading (in degrees)
    return compassHeading * radToDeg;

};