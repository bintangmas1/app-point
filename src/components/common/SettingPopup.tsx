import { useDarkMode } from "../../hooks/useDarkMode";
import { useRTLMode } from "../../hooks/useRTLMode";

 
 
const SettingPopup = ({ handleShowSetting, showSetting }: any) => {
	const { theme, handleDarkModeToggle } = useDarkMode();
	const { viewMode, handleRTLToggling } = useRTLMode();

	return (
		<>
			<div
				id="setting-popup-overlay"
				className={showSetting ? "active" : ""}
				onClick={handleShowSetting}
			></div>
			<div
				className={`card setting-popup-card shadow-lg ${
					showSetting ? "active" : ""
				}`}
				id="settingCard"
			>
				<div className="card-body">
					<div className="container">
						<div className="setting-heading d-flex align-items-center justify-content-between mb-3">
							<p className="mb-0">Settings</p>
							<div
								onClick={handleShowSetting}
								className="btn-close"
								id="settingCardClose"
							></div>
						</div>

						<div className="single-setting-panel">
							<div className="form-check form-switch mb-2">
								<input
									className="form-check-input"
									type="checkbox"
									id="availabilityStatus"
									defaultChecked
								/>
								<label
									className="form-check-label"
									htmlFor="availabilityStatus"
								>
									Availability status
								</label>
							</div>
						</div>

						<div className="single-setting-panel">
							<div className="form-check form-switch mb-2">
								<input
									className="form-check-input"
									type="checkbox"
									id="sendMeNotifications"
									defaultChecked
								/>
								<label
									className="form-check-label"
									htmlFor="sendMeNotifications"
								>
									Send me notifications
								</label>
							</div>
						</div>

						<div className="single-setting-panel">
							<div className="form-check form-switch mb-2">
								<input
									className="form-check-input"
									type="checkbox"
									id="darkSwitch"
									checked={theme === "dark"}
									onChange={handleDarkModeToggle}
								/>
								<label className="form-check-label" htmlFor="darkSwitch">
									{theme === "dark" ? "Light" : "Dark"} mode
								</label>
							</div>
						</div>

						<div className="single-setting-panel">
							<div className="form-check form-switch">
								<input
									className="form-check-input"
									type="checkbox"
									id="rtlSwitch"
									checked={viewMode === "rtl"}
									onChange={handleRTLToggling}
								/>
								<label className="form-check-label" htmlFor="rtlSwitch">
									
									{viewMode === "rtl" ? "LTR" : "RTL"} mode
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SettingPopup;
