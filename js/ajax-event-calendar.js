jQuery(function($) {
    var move = null;
    var months = 12;
    output_calendar(move, months);
    // 横移動
    $('#move_controls button').click(function () {
        var months = 12;
        months = $('#period_controls button.active').data('months');
        var move = null;
        var move_now = $('#move_now').data('now');
        if ($(this).hasClass('prev')){
            $('#move_now').data('now', move_now - 1);
        } else if ($(this).hasClass('next')){
            $('#move_now').data('now', move_now + 1);
        }
        move = $('#move_now').data('now');
        $('#move_controls button.active').removeClass('active');
        $(this).addClass('active');
        output_calendar(move, months);
    });
    // 表示期間
    $('#period_controls button').click(function () {
        var move = null;
        var months = 12;
        if ($('#move_controls button.active').data('move')){
            move = $('#move_controls button.active').data('move');
        }
        months = $(this).data('months');
        $('#period_controls button.active').removeClass('active');
        $(this).addClass('active');
        output_calendar(move, months);
    });
    // Add Money Data
    $("#Add_Money_Submit").click(function(){
        $.ajax({
            url: "/money/1/?action=ajax_add_money",
            type: "POST",
            data: $("form#Add_Money_Form").serialize(),
            success: function(json){
                var move = $('#move_now').data('now');
                var months = 12;
                months = $('#period_controls button.active').data('months');
                output_calendar(move, months);
                notif({
                    msg: "入出金を追加しました",
                    type: "info",
                    position: "center"
                });
            },
            error: function(){
                notif({
                    msg: "入出金の追加に失敗しました",
                    type: "info",
                    position: "center"
                });
            }
        });
        $('#Add_Money').modal('hide')
    });
    // Update Money Data
    $("#Update_Money_Submit").click(function(){
        $.ajax({
            url: "/money/1/?action=ajax_update_money",
            type: "POST",
            data: $("form#Update_Money_Form").serialize(),
            success: function(json){
                var move = $('#move_now').data('now');
                var months = 12;
                months = $('#period_controls button.active').data('months');
                output_calendar(move, months);
                notif({
                    msg: "入出金を更新しました",
                    type: "info",
                    position: "center"
                });
            },
            error: function(){
                notif({
                    msg: "入出金の更新に失敗しました",
                    type: "info",
                    position: "center"
                });
            }
        });
        $('#Update_Money').modal('hide')
    });
    // Delete Money Data
    $("#Delete_Money_Submit").click(function(){
        $.ajax({
            url: "/money/1/?action=ajax_delete_money",
            type: "POST",
            data: $("form#Delete_Money_Form").serialize(),
            success: function(json){
                var move = $('#move_now').data('now');
                var months = 12;
                months = $('#period_controls button.active').data('months');
                output_calendar(move, months);
                notif({
                    msg: "入出金を削除しました",
                    type: "info",
                    position: "center"
                });
            },
            error: function(){
                notif({
                    msg: "入出金の削除に失敗しました",
                    type: "info",
                    position: "center"
                });
            }
        });
        $('#Delete_Money').modal('hide')
    });
    // Change item, then get the ammount from json
    $("select#AddSelectItem").change(function () {
        var jsonurl = '/ajax/get_item/' + $(this).val() + '/';
        $.getJSON(jsonurl,function(json){
            if (json.default_ammount){
                $('input#AddInputAmmount').val(json.default_ammount);
            }
        });
    });
    $("select#SelectItem").change(function () {
        var jsonurl = '/ajax/get_item/' + $(this).val() + '/';
        $.getJSON(jsonurl,function(json){
            if (json.default_ammount){
                $('input#InputAmmount').val(json.default_ammount);
            }
        });
    });
});
// Create Calendar
function output_calendar(move, months){
    $('#moneys').empty();
    $('.year').empty();
    $('#moneys').append('<thead><tr><th></th></tr></thead><tbody></tbody><tfoot><tr><th></th></tr></tfoot>');
    var start_date_year = moment().year();
    if (months) {
        period_months = months;
        if (months == 1){
            start_date_month = moment(moment().add(1, 'months')).month();
        } else if (months == 3){
            start_date_month = moment().month();
        } else if (months == 12){
            start_date_month = 1;
        } else {
            start_date_month = 1;
        }
    } else {
        start_date_month = 1;
        period_months = 12;
    }
    var start_date = String(start_date_year) + '-' + String(start_date_month) + '-1';
    moment_start_date = moment(start_date, "YYYY-MM-DD");
    if (move != null){
        moment_start_date = moment(moment_start_date).add(move*period_months, 'months')
    } else {
        moment_start_date = moment(moment_start_date)
    }
    $('.year').append(moment_start_date.year() + '年');
    for (var i=0; i<period_months; i++) {
        $('#moneys thead tr').append('<th>' + String(moment(moment_start_date).add(i, 'months').month() + 1) + '月</th>');
        $('#moneys tfoot tr').append('<th>' + String(moment(moment_start_date).add(i, 'months').month() + 1) + '月</th>');
    }
    for (var i=0; i<31; i++) {
        $('#moneys tbody').append('<tr id="day_row_' + String(i+1) + '"><th>' + String(i+1) + '日</th></tr>');
        for (var j=0; j<period_months; j++) {
            if (moment(String(moment_start_date.year()) + '-' + String(moment(moment_start_date).month()+j+1) + '-' + String(i+1), "YYYY-MM-DD").isValid() == true){
                var cellclass = '';
                if (moment(String(moment_start_date.year()) + '-' + String(moment(moment_start_date).month()+j+1) + '-' + String(i+1)).format('YYYY-MM') == moment().format('YYYY-MM') || moment(String(moment_start_date.year()) + '-' + String(moment(moment_start_date).month()+j+1) + '-' + String(i+1)).format('YYYY-DD') == moment().format('YYYY-DD')){
                    cellclass = ' bg-info';
                }
                $('#day_row_' + String(i+1)).append('<td class="cell_' + String(moment(String(moment_start_date.year()) + '-' + String(moment(moment_start_date).month()+j+1) + '-' + String(i+1)).format('YYYY-MM-DD')) + cellclass + '"><p><button class="btn btn-sm" data-toggle="modal" data-target="#Add_Money" data-date="' + String(moment(String(moment_start_date.year()) + '-' + String(moment(moment_start_date).month()+j+1) + '-' + String(i+1)).format('YYYY-MM-DD')) + '"><i class="fa fa-plus"></i></button></p></td>');
            } else {
                $('#day_row_' + String(i+1)).append('<td></td>');
            }
        }
    }
    get_money(moment_start_date.year(), moment_start_date.month()+1, period_months);
}
// Get Data from json. And insert event to calendar
function get_money(year, month, period_months){
    /*
    var get_money_url = '/ajax/get_moneys/' + 1 + '/' + year + '/' + month + '/1/' + period_months + '/';
    $.getJSON(get_money_url, {
        start:$.now()
    },function(json){
        $.each(json, function(i, data){
    */
    var data = [{"ammount":"-110000","balance":"340000","date":"2015-05-01","editable":true,"item":"口座移動|出","money_id":"345","summary":"生活費"},{"ammount":"-30000","balance":"310000","date":"2015-05-01","editable":true,"item":"実家","money_id":"346","summary":""},{"ammount":"-5000","balance":"305000","date":"2015-05-02","editable":true,"item":"電気料金","money_id":"348","summary":""}]
        $.each(json, function(i, data){
            if (data.date){
                var ammountclass = '';
                var ammounticon = '';
                var balanceclass = '';
                var summarybr = '';
                if (data.ammount < 0) {
                    ammountclass = 'text-danger';
                }
                if (data.balance < 0) {
                    balanceclass = 'text-danger';
                }
                if (data.summary) {
                    summarybr = '<br /><i class="fa fa-question-circle"></i>';
                }
                var ammount = separate(data.ammount);
                var balance = separate(data.balance);
                if (!$('.cell_child_' + data.date)[0]){
                $('.cell_' + data.date).append('<table class="table table-bordered table-condensed table-hover cell_child_' + data.date + '"></table>');
                }
                $('.cell_child_' + data.date).append('<tr class="money_' + data.money_id + '" data-toggle="modal" data-target="#Update_Money" data-momey_id="' + data.money_id + '"><td><strong class="' + ammountclass + '">' + ammount + '</strong></td><td><span>' + data.item + summarybr + data.summary + '</span></td><td><strong class="' + balanceclass + '">' + balance + '</strong></td></tr>');
                /*
                $('.cell_' + data.date).append('<p class="row money_' + data.money_id + '" data-toggle="modal" data-target="#Update_Money" data-momey_id="' + data.money_id + '"><span class="col-sm-4' + ammountclass + '">' + data.ammount + summarybr + data.summary + '</span><span class="col-sm-4">' + data.item + '</span><span class="col-sm-4' + balanceclass + '">' + data.balance + '</span></p>');
                */
            }
        })
    });
}
function separate(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
jQuery(function($) {
    $('#Add_Money').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var date = button.data('date')
        var modal = $(this)
        modal.find('.modal-body input#AddInputDate').val(date)
    });
    $('#Update_Money').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var momey_id = button.data('momey_id')
        var modal = $(this)
        var get_itemcategory_url = '/ajax/get_money/' + momey_id + '/';
        $.getJSON(get_itemcategory_url, {
            start:$.now()
        },function(json){
            modal.find('.modal-body input#EditMoneyID').val(json.money_id)
            modal.find('.modal-body input#DeleteMoneyID').val(json.money_id)
            modal.find('.modal-body input#InputDate').val(json.date)
            modal.find('.modal-body select#SelectItem').val(json.item_id)
            modal.find('.modal-body input#InputAmmount').val(json.ammount)
            modal.find('.modal-body input#InputSummary').val(json.summary)
        });
    });
});
