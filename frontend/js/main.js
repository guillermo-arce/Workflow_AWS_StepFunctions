$(document).ready(function () {

    var elements = document.querySelectorAll('.input2');
    elements.forEach(function (element) {
        element.value = "";
    });


    // lock scroll position, but retain settings for later
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];
    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input2').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })


    $("#btn-register").click(function () {

        var clientName = $("#input-clientName").val().trim();
        var carModel = $("#input-carModel").val().trim();
        var carId = $("#input-carPlate").val().trim();
        var operationType = "ADD";

        if (clientName.length > 0 && clientName.length < 41
            && carModel.length > 0 && carModel.length < 41
            && carId.length == 7) {
            debugger;

            $.ajax({
                url: "https://3s2o8s03v2.execute-api.eu-west-3.amazonaws.com/dev/run",
                type: "GET",
                data: {
                    clientName: clientName,
                    carModel: carModel,
                    carId: carId,
                    operationType: operationType
                },
                success: function (result) {
                    $("#addAlert").show("slow");
                    var elements = document.querySelectorAll('.input2');
                    elements.forEach(function (element) {
                        element.value = "";
                    });
                },
                error: function (error) {
                    alert(error);
                }
            });
        }
        else {
            alert("Please,revise the input");
        }

    });

    $("#btn-remove").click(function () {
        var carId = $("#remove-carPlate").val().trim();
        var operationType = "REMOVE";

        if (carId.length == 7) {
            debugger;
            $.ajax({
                url: "https://3s2o8s03v2.execute-api.eu-west-3.amazonaws.com/dev/run",
                type: "GET",
                data: {
                    carId: carId,
                    operationType: operationType
                },
                success: function (result) {
                    $("#removeAlert").show("slow");
                    var elements = document.querySelectorAll('.input2');
                    elements.forEach(function (element) {
                        element.value = "";
                    });
                },
                error: function (error) {
                    alert(error);
                }
            });
        }else{
            alert("Please,revise the input");
        }

    });

    $("#removeAlert").click(function () {
        if ($("#removeAlert").css('display') != 'none')
            $("#removeAlert").hide("slow");
    });

    $("#addAlert").click(function () {
        if ($("#addAlert").css('display') != 'none')
            $("#addAlert").hide("slow");
    });







});