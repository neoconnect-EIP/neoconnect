package c.eip.navigation.loggedIn.influenceur


import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.Constants
import c.eip.R
import c.eip.model.Influenceur
import c.eip.services.AuthAPI
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditProfil : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_influenceur_edit_profil, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val dataGetter = AuthAPI.DataGetter()
        val token = dataGetter.getToken(context!!)
        view.findViewById<TextInputEditText>(R.id.pseudoInf)?.hint = ProfilFragment.infData?.pseudo
        view.findViewById<TextInputEditText>(R.id.emailInf)?.hint = ProfilFragment.infData?.email
        view.findViewById<TextInputEditText>(R.id.phoneInf)?.hint = ProfilFragment.infData?.phone
        view.findViewById<TextInputEditText>(R.id.nomInf)?.hint = ProfilFragment.infData?.full_name
        view.findViewById<TextInputEditText>(R.id.facebook)?.hint = ProfilFragment.infData?.facebook
        view.findViewById<TextInputEditText>(R.id.twitterInf)?.hint =
            ProfilFragment.infData?.twitter
        view.findViewById<TextInputEditText>(R.id.instagramInf)?.hint =
            ProfilFragment.infData?.instagram
        view.findViewById<TextInputEditText>(R.id.snapchatInf)?.hint =
            ProfilFragment.infData?.snapchat
        view.findViewById<TextInputEditText>(R.id.villeInf)?.hint = ProfilFragment.infData?.city
        view.findViewById<TextInputEditText>(R.id.postalInf)?.hint = ProfilFragment.infData?.postal
        view.findViewById<TextInputEditText>(R.id.themeInf)?.hint = ProfilFragment.infData?.sujet

        view.findViewById<Button>(R.id.saveInfProfil).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.pseudoInf).text.toString()
            val password = view.findViewById<TextInputEditText>(R.id.passwordInf).text.toString()
            val city = view.findViewById<TextInputEditText>(R.id.villeInf).text.toString()
            val name = view.findViewById<TextInputEditText>(R.id.nomInf).text.toString()
            val email = view.findViewById<TextInputEditText>(R.id.emailInf).text.toString()
            val phone = view.findViewById<TextInputEditText>(R.id.phoneInf).text.toString()
            val postal = view.findViewById<TextInputEditText>(R.id.postalInf).text.toString()
            val theme = view.findViewById<TextInputEditText>(R.id.themeInf).text.toString()
            val snapchat = view.findViewById<TextInputEditText>(R.id.snapchatInf).text.toString()
            val facebook = view.findViewById<TextInputEditText>(R.id.facebook).text.toString()
            val twitter = view.findViewById<TextInputEditText>(R.id.instagramInf).text.toString()
            val instagram = view.findViewById<TextInputEditText>(R.id.twitterInf).text.toString()
            updateData(
                token,
                pseudo,
                password,
                city,
                name,
                email,
                phone,
                postal,
                theme,
                snapchat,
                facebook,
                twitter,
                instagram
            )
        }
    }

    private fun updateData(
        token: String?,
        pseudo: String,
        password: String,
        city: String,
        name: String,
        email: String,
        phone: String,
        postal: String,
        theme: String,
        facebook: String,
        twitter: String,
        snapchat: String,
        instagram: String
    ) {
        inf.pseudo = pseudo
        inf.password = password
        inf.city = city
        inf.full_name = name
        inf.email = email
        inf.phone = phone
        inf.postal = postal
        inf.sujet = theme
        inf.facebook = facebook
        inf.twitter = twitter
        inf.snapchat = snapchat
        inf.instagram = instagram
        val call = profilService.updateInfProfil(token, inf)
        call.enqueue(object : Callback<Influenceur> {
            override fun onResponse(call: Call<Influenceur>, response: Response<Influenceur>) {
                if (response.isSuccessful) {
                    findNavController().navigate(R.id.influenceur_profil, null)
                    Log.i("Edit influenceur", "OK")
                }
            }

            override fun onFailure(call: Call<Influenceur>?, t: Throwable) {
                Log.e("Edit erreur:", t.message)
            }
        })
    }

    companion object {
        var inf = Influenceur()
        var profilService = Constants.profilService
    }
}
