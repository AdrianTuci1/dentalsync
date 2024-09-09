import { useState } from "react";
import { convert } from "../utils/teeth-numbering-system";
import { conditionToColor } from "../utils/conditionToColor";


const TeethPermanentChart = ({ teeth }) => {
  const [selectedTooth, setSelectedTooth] = useState(null);

  const handleToothClick = (ISO) => {
    const toothInfo = convert(ISO); // Use the convert function to get Palmer, Universal, and Name
    setSelectedTooth(toothInfo); // Set the selected tooth information in the state
  };

  return (
    <div>
      <svg
        style={{ maxHeight: "600px" }}
        version="1.1"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 560 1055"
      >
        <defs>
          {/* Example for tooth 11 */}
					<path
						style={{ cursor: "pointer" }}
						d="M266.17 8.55C259.99 -4.36 193.1 6.32 197.86 21.38C206.17 47.66 225.74 73.28 248.05 67.4C267.9 62.17 262.54 20.32 266.17 8.55Z"
						id="iso-11"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M250.64 19.39C239.08 14.5 227 16.21 214.06 26.43"
						id="iso-11a"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M145.49 62.43C137.94 40.31 191.03 12.91 200.03 32.34C205.95 45.15 204.62 79.12 191.95 86.18C177.61 94.17 150.76 77.86 145.49 62.43Z"
						id="iso-12"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M186.48 40.87C177.65 41.5 170.4 40.72 159.99 53.98"
						id="iso-12a"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M150.11 75.16C142.5 69.28 129.83 70.79 121.26 75.16C111.64 80.07 105.24 91.01 102.25 101.39C99.52 110.86 104.3 132.99 114.05 131.55C134.71 128.49 156.11 139.07 161.91 120.4C167.02 103.98 162.44 84.69 150.11 75.16Z"
						id="iso-13"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M137.24 82.38C117.15 85.94 113.51 101.9 112.46 113.44"
						id="iso-13a"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M18.36 529.31C18.36 529.31 7.02 525.35 5.37 504.43C4.86 497.88 13.89 490.15 12.81 482.51C10.67 467.32 21.2 448.9 31.68 446.13C58.89 438.94 72.33 459.38 79.53 476.93C86.12 492.99 79.12 515.06 68.15 527.74C56.25 534.5 32.29 530.07 18.36 529.31Z"
						id="iso-18"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M98.89 414.82C91.72 434.68 71.23 446.39 48.57 441.68C28.93 437.59 16.41 426.82 11.8 400.23C7.47 375.3 4.28 345.65 48.9 345.64C91.28 345.62 114.44 371.79 98.89 414.82Z"
						id="iso-17"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M78.88 362.56C72.53 364.71 61.58 363.31 60.14 370.37C59.95 371.31 58.41 378.85 58.22 379.79C62.2 382.7 69.4 379.52 75.18 379.02C75.16 379.44 55.97 386.13 55.81 386.2C53.89 387.07 49.14 400.59 53.55 406.92C61.81 412.09 70.99 407.73 79.55 407.88C71.38 409.57 59.68 411.06 58.93 413.2C57.6 420.28 56.36 425.9 55.13 431.44C55.14 425.13 56.46 418.45 52.15 413.39C41.3 410.68 40.92 412.54 35.26 412.97C40.74 411.11 44.03 406.54 46.15 400.52C48.16 392.44 46.33 392.05 45.45 389.75C39.48 387.56 36.28 390.97 31.82 391.32C37.61 388.74 44.41 385.5 49.31 381.64C55.02 377.15 47.89 371.47 42.78 366.36C49.45 364.88 56.47 365.06 61.1 354.34C62.36 362.44 71.16 361.06 78.88 362.56Z"
						id="iso-17a"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M44.65 266.85C44.65 266.85 32.12 267.49 26.4 284.67C24.61 290.05 32.51 298.7 29.93 304.86C24.79 317.11 28.02 335.09 38.38 339.9C45.63 343.28 58.05 342.06 64.03 342.11C80.21 342.25 90.22 334.9 98.14 325.38C108.05 313.45 105.01 293.25 96.05 279.99C84.99 271.49 59.26 269.52 44.65 266.85Z"
						id="iso-16"
					/>
          					<path
						style={{ cursor: "pointer" }}
						d="M56.94 494.91C60.48 492.65 67.62 496.05 72.83 497.1C71.34 496.21 59.47 489.15 57.98 488.26C52.76 480.91 55.48 474.74 55.2 467.8C51.42 468.58 48.21 465.25 45.07 461.37C45.68 465.45 50.5 471.58 45.68 473.01C44.93 472.73 41.17 471.36 34.4 468.9C41.23 473.96 45.02 476.77 45.78 477.33C45.78 477.33 48.56 483.47 46 482.51C43.43 481.56 31.11 484.1 31.11 484.1C31.11 484.1 43.66 483.26 48.24 488.28C52.82 493.3 52.75 496.35 53.21 499.76C53.68 503.17 52.89 506.57 54.97 509.07C56.8 511.28 63.26 512.72 63.26 512.72C59.78 506.61 57.11 500.6 56.94 494.91Z"
						id="b2DYah0Bi"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M124.86 144.48C120.94 136.65 109.98 133 101.25 133.32C91.45 133.67 81.91 140.28 75.4 147.74C69.45 154.55 63.37 185.34 71.92 187.91C90.03 193.36 104.78 206.01 116.86 192.75C127.48 181.1 131.22 157.16 124.86 144.48Z"
						id="iso-14"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M104.66 146.08C96.02 147.61 88.62 150.83 84.96 155.61C80.11 161.94 80.47 170.56 79.88 177.14"
						id="b6fpiYGql"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M69.15 299.11C72.26 301.81 79.33 298.09 84.34 297.03C82.86 298.01 70.96 305.83 69.47 306.81C63.82 315.15 65.77 322.32 64.82 330.31C61.33 329.32 57.97 333.06 54.63 337.45C55.61 332.77 60.76 325.83 56.36 324.06C55.62 324.35 51.94 325.83 45.32 328.49C52.25 322.84 56.11 319.7 56.88 319.07C56.88 319.07 60.11 312.08 57.6 313.11C55.08 314.14 43.72 310.87 43.72 310.87C43.72 310.87 55.47 312.18 60.29 306.52C65.1 300.86 65.34 297.34 66.11 293.42C66.89 289.51 66.48 285.57 68.69 282.74C70.63 280.25 76.87 278.76 76.87 278.76C72.98 285.71 69.87 292.56 69.15 299.11Z"
						id="b6rcDQpXhc"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M91.09 200.85C85.15 193.29 72.49 191.66 63.11 193.81C52.59 196.23 43.71 205.28 38.28 214.61C33.32 223.13 37.92 262.17 47.73 263.15C68.51 265.22 86.64 275.94 96.82 259.25C105.78 244.58 100.73 213.1 91.09 200.85Z"
						id="iso-15"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M47.29 239.85C48.2 237.5 47.09 235.21 47.29 233.03C47.82 226.98 48.23 221.74 51.73 217.98C53.09 216.51 54.68 215.22 56.42 214.05C61.11 210.89 66.87 208.65 72.13 206.52"
						id="b22znv61x"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M89.08 186.79C96.72 187.31 104.32 187.57 108.8 184.62C116.26 179.71 118.22 169.44 120.59 162.59"
						id="cyecxkyP8"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M65.93 256.06C86.29 257.43 88.65 244.61 92.44 233.66"
						id="a3AsQKojJ1"
					/>
          {/* Add paths for the other teeth as in your original code */}
        </defs>
        {/* Render teeth as interactive elements */}
        <g className="main">
          {/* Example: */}
          <g className="q1">
            <g className="1" onClick={() => handleToothClick(11)}>
              <use xlinkHref="#iso-11" fill="#ccc" /> {/* Adjust fill based on condition */}
              <g>
                <use xlinkHref="#iso-11" fillOpacity="0" stroke="#000" strokeWidth="2" />
              </g>
              <g>
								<use
									xlinkHref="#iso-11a"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#iso-11a"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
            </g>
            <g className="2" onClick={() => handleToothClick(12)}>
							<g>
								<use
									xlinkHref="#iso-12"
                  fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-12"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#iso-12a"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#iso-12a"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
            {/* Render other teeth */}
            <g className="3" onClick={() => handleToothClick(13)}>
							<g>
								<use
									xlinkHref="#iso-13"
                  fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-13"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#iso-13a"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#iso-13a"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => handleToothClick(14)}>
							<g>
								<use
									xlinkHref="#iso-14"
									fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-14"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b6fpiYGql"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b6fpiYGql"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#cyecxkyP8"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#cyecxkyP8"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => handleToothClick(15)}>
							<g>
								<use
									xlinkHref="#iso-15"
									fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-15"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b22znv61x"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b22znv61x"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a3AsQKojJ1"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#a3AsQKojJ1"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="6" onClick={() => handleToothClick(16)}>
							<g>
								<use
									xlinkHref="#iso-16"
									fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-16"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b6rcDQpXhc"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#b6rcDQpXhc"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="7" onClick={() => handleToothClick(17)}>
							<g>
								<use
									xlinkHref="#iso-17"
									fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-17"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#iso-17a"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#iso-17a"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="8" onClick={() => handleToothClick(18)}>
							<g>
								<use
									xlinkHref="#iso-18"
									fill="#ccc"
								/>
								<g>
									<use
										xlinkHref="#iso-18"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b2DYah0Bi"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#b2DYah0Bi"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
            
            
          </g>
        </g>
      </svg>

      {/* Display the selected tooth information */}
      {selectedTooth && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Selected Tooth Information</h3>
          <p><strong>Name:</strong> {selectedTooth.Name}</p>
          <p><strong>Palmer:</strong> {selectedTooth.Palmer}</p>
          <p><strong>Universal:</strong> {selectedTooth.Universal}</p>
          <p><strong>ISO:</strong> {selectedTooth.ISO}</p>
        </div>
      )}
    </div>
  );
};

export default TeethPermanentChart;

