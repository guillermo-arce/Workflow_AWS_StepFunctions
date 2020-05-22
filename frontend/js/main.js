$( document ).ready(function() {


    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input2').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
            

    $("#btn-register").click(function(){
        var clientName = $("#input-clientName").val().trim();
        var carModel = $("#input-carModel").val().trim();
        var carId = $("#input-carPlate").val().trim();
        var operationType = "ADD";

        if(clientName.length>0 && clientName.length<26 
            && carModel.length>0 && carModel.length<26
                && carId.length==7){
                    debugger;
                    $.ajax({
                        url: "https://3s2o8s03v2.execute-api.eu-west-3.amazonaws.com/dev/run",
                        type: "GET",
                        data: { 
                          clientName: clientName, 
                          carModel: carModel, 
                          carId: carId,
                          operationType: operationType
                        }
                        // success: function(response) {
                        //     alert(response);
                        // },
                        // error: function(xhr) {
                        //     alert("ERROR"+xhr);
                        // }
                      });
                }

    });

    $("#btn-remove").click(function(){
        var carId = $("#remove-carPlate").val().trim();
        var operationType = "REMOVE";

        if(carId.length==7){
            debugger;
            $.ajax({
                url: "https://3s2o8s03v2.execute-api.eu-west-3.amazonaws.com/dev/run",
                type: "GET",
                data: { 
                    carId: carId,
                    operationType: operationType
                }
                // success: function(response) {
                //     alert(response);
                // },
                // error: function(xhr) {
                //     alert("ERROR"+xhr);
                // }
                });
                }

    });
    
    

});