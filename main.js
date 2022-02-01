/*
For Task 1, we used the sorting algorithm provided by W3Schools: How TO - Sort a Table: https://www.w3schools.com/howto/howto_js_sort_table.asp.
For task 3 & 4, we took inspiration from LearnCode.Academy's excellent video on jQuery and AJAX: https://www.youtube.com/watch?v=5nL7X1UMWsc&ab_channel=LearnCode.academy
*/


//Task 1 (jQuery not used)

//get all table headers
th = document.getElementsByTagName('th');

for(let i=1; i < th.length; i++){
    th[i].addEventListener('click',sort(i));
}

function sort(n){
    return function(){
        console.log('col ' + n)
        sortTable(n);
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, order, switchcount;
    table = document.getElementById("phonetable");
    switchcount = 0;
    switching = true;
    order = "ascending"; 

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 5); i++) { //number of items to sort = total rows -  (header + input fields + submit button)
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            if (order == "ascending") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch= true;
                    break;
                }
            }
            else if (order == "descending") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }  

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        }
        else if (switchcount == 0 && order == "ascending") {
            switching = true;
            order = "descending";
        }
    }
}

//For task 2,3 & 4 we mainly used console.log() for debugging

$(function() {

    var $formHeader = $('#formHeader')

    var $insertFields = $('#insertFields');

    var $image = $('#image');
    var $brand = $('#brand');
    var $model = $('#model');
    var $os = $('#os');
    var $screensize = $('#screensize');

    fillRows();



    $('#form').submit(function (e) {

        e.preventDefault();

        var $form = $(this);

        //check if form is valid using jQuery validation plugin
        if (!$form.valid) return false;

        var phone = {
            brand: $brand.val(),
            model: $model.val(),
            os: $os.val(),
            image: $image.val(),
            screensize: $screensize.val(),
        };        
        $.ajax({
            type: 'POST',
            url: 'https://wt.ops.labs.vu.nl/api22/12f3d2c2/',
            data: phone,
            success: function() {
                console.log('item added');
                deleteRows();
                fillRows();
                $("#form")[0].reset();
            },
            error: function() {
                console.log('error adding phone');
            }
        });
    });

    //We made this double click in case someone that uses our terrible website accidentally clicks the reset button once
    $('#resetbutton').dblclick(resetDatabase);

    $(document).keypress("r",function(e) {
        if(e.altKey)
          resetDatabase();
    });

    function deleteRows() {
        numPhones = $('#phonetable tr').length - 5; //number of items = total rows -  (header + form)
        for (i = 0; i < numPhones; i++){
            $("#phonetable tr:eq(1)").remove();
        }
        console.log('deleteRows success deleting rows');
    };

    function fillRows() {
        $.ajax({
            type: "GET",
            url: 'https://wt.ops.labs.vu.nl/api22/12f3d2c2/',
            success: function(phones) {
                console.log('fillRows success loading data', phones);
                $.each(phones, function(i, phone) {
                    addRow(phone);
                    console.log('fillRows success filling data');
                });
                $insertFields.trigger("reset");
            },
            error: function() {
                console.log('fillRows error filling data');
            }
        });
    };

    function addRow(phone) {
        $formHeader.before('<tr><td><img src ="' + phone.image + '" alt="image of phone" class="bestsellerimg"</td><td>' + phone.brand + '</td><td>' + phone.model + '</td><td>' + phone.os + '</td><td>' + phone.screensize + '</td></tr>');
    };

    function resetDatabase() {
        deleteRows();
        $.ajax({
            type: "GET",
            url: 'https://wt.ops.labs.vu.nl/api22/12f3d2c2/reset',
            success: function (phones) {
                $.each(phones, function() {
                    $(this).remove();
                    fillRows();
                    console.log('resetDatabase success resetting');
                });
                console.log('resetDatabase success loading data', phones);
            },
            error: function() {
                console.log('resetDatabase error loading data');
            }
        });  
    };
})