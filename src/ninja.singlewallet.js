(function (wallets, qrCode) {
	var single = wallets.singlewallet = {
		isOpen: function () {
			return (document.getElementById("singlewallet").className.indexOf("selected") != -1);
		},

		open: function () {
			if (document.getElementById("btcaddress").innerHTML == "") {
				single.generateNewAddressAndKey();
			}
			document.getElementById("singlearea").style.display = "block";
		},

		close: function () {
			document.getElementById("singlearea").style.display = "none";
		},

		// generate bitcoin address and private key and update information in the HTML
		generateNewAddressAndKey: function () {
			try {
				var key = new Bitcoin.ECKey(false);
				key.setCompressed(true);
				var bitcoinAddress = key.getBitcoinAddress();
				var privateKeyWif = key.getBitcoinWalletImportFormat();
				document.getElementById("btcaddress").innerHTML = bitcoinAddress;
				document.getElementById("btcprivwif").innerHTML = privateKeyWif;

				var encoder = new Base58ExtHanzi();
				var bitcoinAddressHanzi = encoder.encode(bitcoinAddress);
				var privateKeyWifHanzi = encoder.encode(privateKeyWif);
				// 给 bitcoinAddressHanzi 每10个字加一个 <br>（不在末尾添加）
				var formattedHanziAddress = bitcoinAddressHanzi.replace(/(.{17})(?!$)/g, '$1<br>');
				// 给 privateKeyWifHanzi 每15个字加一个 <br>（不在末尾添加）
				var formattedHanziPrivateKey = privateKeyWifHanzi.replace(/(.{26})(?!$)/g, '$1<br>');
				document.getElementById("btcaddress-hanzi").innerHTML = formattedHanziAddress;
				document.getElementById("btcprivwif-hanzi").innerHTML = formattedHanziPrivateKey;

				var keyValuePair = {
					"qrcode_public": bitcoinAddress,
					"qrcode_private": privateKeyWif
				};
				qrCode.showQrCode(keyValuePair, 4);
			}
			catch (e) {
				// browser does not have sufficient JavaScript support to generate a bitcoin address
				alert(e);
				document.getElementById("btcaddress").innerHTML = "error";
				document.getElementById("btcprivwif").innerHTML = "error";
				document.getElementById("qrcode_public").innerHTML = "";
				document.getElementById("qrcode_private").innerHTML = "";
			}
		}
	};
})(ninja.wallets, ninja.qrCode);
