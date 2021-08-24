$(document).ready(function () {

	//pdf 다운로드 	
	$("#pdfDownloader").click(function () {

		html2canvas(document.getElementById("printDiv"), {
			dpi: 600, // Set to 300 DPI
			margin: [30, 30, 30, 30], //top, left, buttom, right
			onrendered: function (canvas) {

				var imgData = canvas.toDataURL('image/png');
				console.log('Report Image URL: ' + imgData);
				var doc = new jsPDF('L', 'mm', [297, 210]); //297mm high / 210mm wide

				doc.addImage(imgData, 'PNG', 10, 10);
				doc.save('sample.pdf');
			}
		});

	});


})