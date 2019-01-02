$("#sidebar-interactionanalysis").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Interaction Analysis");

function init() {

}

function unfriend(uid, name) {
    swal({
        title: 'Are you sure?',
        text: `You are about to unfriend ${name} (${uid}). You won't be able to revert this!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unfriend them!'
    }).then((result) => {
        if (result) {
            $.ajax({
                async: !1,
                method: "POST",
                url: "https://www.facebook.com/ajax/profile/removefriendconfirm.php?dpr=1",
                data: {
                    uid: uid,
                    fb_dtsg: _dtsg,
                    __a: '1'
                },
                success: resp => {
                    resp = JSON.parse(resp.slice(9));

                    if (resp.error) {
                        swal('An error has occured!', `Unable to unfriend ${name}. Please try again later!`, 'error');
                    } else {
                        swal(
                            'Unfriended!',
                            `You and ${name} are no longer friends!`,
                            'success'
                        );
                        $(`#${uid}`).fadeOut();
                    }


                },
                error: resp => {
                    swal({
                        type: "error",
                        title: "Ooops! ",
                        text: `An error has occured! Unable to unfriend ${name}.`
                    })
                }
            })
        }
    })
}


$("#rank_value").submit(function(evt) {
    evt.preventDefault();
    loadingsth(1);
    $("#rank_value").find("button").attr("disabled", "true");
    browser.runtime.sendMessage({
        do: "interactionAnalysis"
    }).then(r => {
        if (!r.error) {
            loadingsth(0);
            swal(
                'Success!',
                `Think twice before you unfriend someone`,
                'success'
            )
            commentspoint = $("#rank_value_comment").val()
            reactionspoint = $("#rank_value_reaction").val()
            postspoint = $("#rank_value_post").val()
            result = r.response;
            result.sort(function(a, b) {
                return (b.comments * commentspoint + b.reactions * reactionspoint + b.posts * postspoint) - (a.comments * commentspoint + a.reactions * reactionspoint + a.posts * postspoint);
            });
            i = 0;
            result.forEach(user => {
                i++;
                $("#rank_result").append(`
                <tr class="table-user" id="${user.id}">
                <td class="text-center">${i}</td>
                <td class="text-center"><img src="https://graph.facebook.com/${user.id}/picture?width=40&amp;height=40" class="rounded-circle"></td>
                <td class="text-center" class="table-username">${user.name}</td>
                <span class="sr-only table-uid">${user.id}</span>
                <td class="text-center">${user.comments * commentspoint + user.reactions * reactionspoint + user.posts * postspoint}</td>
                <td class="text-center">${user.reactions}</td>
                <td class="text-center">${user.comments}</td>
                <td class="text-center">${user.posts}</td>
                <td class="td-actions text-right"><button data-delete="${user.id};${user.name}" class="btn btn-link btn-danger btn-just-icon remove table-unfriend"><i class="material-icons ">close</i></button></td>
                </tr>
                `)
            });
            $('.table-unfriend').click(function() {
                dt = $(this).attr("data-delete").split(';');
                unfriend(dt[0], dt[1]);
            })
            $('#rank_table').DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search name",
                }
            });

        } else {
            swal("An error has occurred", `${r.errorText}`, "error");
            loadingsth(0);
        }
    });

});