import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, Typography } from '@mui/material';
import { strings } from '../strings'
import { Check, Close, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRef, useState } from 'react';
import ServerProxy from '../tools/serverProxy';


export default function PasswordChangeDialog(props) {

	const { user, open = true, onClose } = props;

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [errorMessage, setErrorMessage] = useState(null);

	const currentPasswordRef = useRef(null);
	const newPasswordRef = useRef(null);
	const confirmPasswordRef = useRef(null);

	const onAction = async function (event) {

		event.preventDefault();
		setErrorMessage(null);

		const currentPassword = currentPasswordRef.current.value;
		const password = newPasswordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;

		//console.log( password, confirmPasswordRef);

		if (password.length < 4) {
			// setErrorMessage(strings.passwordLenghtError);
			props.setAlert(prevState => ({
				...prevState,
				message: strings.passwordLenghtError,
				hide: 1,
				severity: "error"
			}));
			return;

		} else if (password !== confirmPassword) {
			props.setAlert(prevState => ({
				...prevState,
				message: strings.passwordNotMatch,
				hide: 1,
				severity: "error"
			}));

			// setErrorMessage(strings.passwordNotMatch);
			return;
		}
		else {

			try {

				await ServerProxy.setUserPassword(user.id, {
					oldPassword: currentPassword,
					newPassword: password
				});
				onClose();
				props.setAlert(prevState => ({
					...prevState,
					message: strings.status200Operation,
					hide: 1,
					severity: "success"
				}));

			} catch (error) {
				console.log("Errore");
				console.log(error);


				if (error?.response) {
					const { data } = error.response;

					if (data) {
						props.setAlert(prevState => ({
							...prevState,
							message: data.message,
							hide: 1,
							severity: "error"
						}));
					}
				}

			}

		}
	}

	return (

		<Dialog
			open={open}
			onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose() }}
			maxWidth={'xs'}
			fullWidth={true}
			sx={{
				'& .MuiDialog-paper': {
					p: 2,  // Add padding to the entire dialog paper
				}
			}}
		>


			<DialogTitle sx={{ fontSize: "32px", fontWeight: "500", position: "relative" }} id="draggable-dialog-title">
				{props.alert.hide ? (
					<Alert
						sx={{
							position: "fixed",
							top: "1%",
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 1301,
							width: "auto",
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
							borderRadius: '16px',
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							display: "flex",
							alignItems: "center",
						}}
						severity={props.alert.severity}
						title={props.alert.message}
					>
						<span style={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
							{props.alert.message}
						</span>
					</Alert>
				) : null}
				{strings.changePassword}

				<Divider />
			</DialogTitle>


			<DialogContent >
				<Box component={'form'} onSubmit={onAction} >
					<Stack spacing={3} sx={{ py: 3 }}>
						{/* 
						{errorMessage && (
							<Typography variant="caption" gutterBottom color={'error'} sx={{ display: 'block' }}>
								{errorMessage}
						  	</Typography>
						)} */}

						<FormControl sx={{ width: '100%' }} variant="outlined">
							<InputLabel htmlFor="currentPasswordId">{strings.currentPassword}</InputLabel>
							<OutlinedInput
								id="currentPasswordId"
								inputRef={currentPasswordRef}
								required
								type={showCurrentPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={(show) => setShowCurrentPassword((show) => !show)}
											edge="end"
										>
											{showCurrentPassword ? < Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
								label={strings.currentPassword}
							/>
						</FormControl>

						<FormControl sx={{ width: '100%' }} variant="outlined">
							<InputLabel htmlFor="newPasswordId">{strings.newPassword}</InputLabel>
							<OutlinedInput
								id="newPasswordId"
								inputRef={newPasswordRef}
								required
								type={showNewPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={(show) => setShowNewPassword((show) => !show)}
											edge="end"
										>
											{showNewPassword ? < Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
								label={strings.newPassword}
							/>
						</FormControl>

						<FormControl sx={{ width: '100%' }} variant="outlined">
							<InputLabel htmlFor="confirmPasswordId">{strings.confirmPassword}</InputLabel>
							<OutlinedInput
								id="confirmPasswordId"
								inputRef={confirmPasswordRef}
								required
								type={showConfirmPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={(show) => setShowConfirmPassword((show) => !show)}
											edge="end"
										>
											{showConfirmPassword ? < Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
								label={strings.confirmPassword}
							/>

							{/* <Box sx={{ width: '100%', textAlign: 'right' }}>
								<Link onClick={() => { }} sx={{ color: 'black', fontSize: '.8rem' }}>clear</Link>
							</Box> */}
						</FormControl>
					</Stack>

					<Stack fullWidth spacing={3} direction={'row'}  >
						<Button sx={{ width: '100%' }} variant="outlined" onClick={onClose}>{strings.discard}</Button>
						<Button type='submit' sx={{ width: '100%' }} variant="contained" color="primary" >{strings.applyChange}</Button>
					</Stack>
				</Box>
			</DialogContent>

		</Dialog>
	)
}