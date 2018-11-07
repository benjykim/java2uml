        $('#dialog').dialog({
            title: 'Add Variable',
            autoOpen:false, //자동으로 열리지않게
      modal: true,
      width: '300',
      height: '300',
      resizable:false, //크기 조절 못하게
      buttons:{
                    "확인":function(){
                        pd.type = $('#type').val()
                        pd.name = $('#name').val()
                        pd.visibility = $('#modifier').val()
                        method_flag = false;
                        $(this).dialog("close");
                    },"취소":function(){
                        $(this).dialog("close");
                    }
                }
        });


var cnt = 0;
        $('#method_dialog').dialog({
            title: 'Add Method',
            autoOpen:false, //자동으로 열리지않게
      modal: true,
      width: '300',
      height: '300',
      resizable:false, //크기 조절 못하게
      buttons:{     "파라미터 추가":function(){
                                            var ptype = "Ptype" + cnt;
                                            var pname = "Pname" + cnt;
                                            var html = '<br> - Parameter </br> <br> Type : <input type="text" id=' +ptype+' maxlength="20" size="10"/> <br> Name : <input type="text" id=' + pname+' maxlength="20" size="10"/></br>'
                                            console.log(html)
                                            $('#method_dialog').append(html);
                                            cnt = cnt +1;
                                            pd.parameters.push({ name : "variable", type : "int" });

                                        },
                    "확인":function(){
                        pd.name = $('#method_name').val()
                        pd.visibility = $('#method_modifier').val()
                        var i =0;
                        for(i=0;i<cnt;++i){
                            var tp1 = "Ptype" + i;
                            var tp2 = "Pname" + i;
                            var tp3 = '#' + tp1;
                            var tp4 = '#' + tp2;
                            pd.parameters[i].type =  $(tp3).val()
                            pd.parameters[i].name = $(tp4).val()
                        }
                        $('#method_dialog').empty();
                        var init = '<br> Modifier : <input type="text" id="method_modifier" maxlength="20" size="10"/> </br> <br> Name : <input type="text" id="method_name" maxlength="20" size="10"/> </br>'
                        $('#method_dialog').append(init);
                        method_flag = false;
                        $(this).dialog("close");
                    }
                }
        });
