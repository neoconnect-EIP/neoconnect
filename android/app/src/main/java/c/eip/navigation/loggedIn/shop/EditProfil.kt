package c.eip.navigation.loggedIn.shop


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
import c.eip.model.Boutique
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
        return inflater.inflate(R.layout.fragment_shop_edit_profil, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val dataGetter = AuthAPI.DataGetter()
        val token = dataGetter.getToken(context!!)
        view.findViewById<TextInputEditText>(R.id.pseudoShop)?.hint =
            ProfilFragment.shopData?.pseudo
        view.findViewById<TextInputEditText>(R.id.passwordShop)?.hint =
            ProfilFragment.shopData?.password
        view.findViewById<TextInputEditText>(R.id.emailShop)?.hint = ProfilFragment.shopData?.email
        view.findViewById<TextInputEditText>(R.id.phoneShop)?.hint = ProfilFragment.shopData?.phone
        view.findViewById<TextInputEditText>(R.id.nomShop)?.hint =
            ProfilFragment.shopData?.full_name
        view.findViewById<TextInputEditText>(R.id.society)?.hint = ProfilFragment.shopData?.society
        view.findViewById<TextInputEditText>(R.id.posteShop)?.hint =
            ProfilFragment.shopData?.fonction
        view.findViewById<TextInputEditText>(R.id.villeShop)?.hint = ProfilFragment.shopData?.city
        view.findViewById<TextInputEditText>(R.id.postalShop)?.hint =
            ProfilFragment.shopData?.postal
        view.findViewById<TextInputEditText>(R.id.themeShop)?.hint = ProfilFragment.shopData?.sujet

        view.findViewById<Button>(R.id.saveShopProfil).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.pseudoShop).text.toString()
            val password = view.findViewById<TextInputEditText>(R.id.passwordShop).text.toString()
            val city = view.findViewById<TextInputEditText>(R.id.villeShop).text.toString()
            val name = view.findViewById<TextInputEditText>(R.id.nomShop).text.toString()
            val email = view.findViewById<TextInputEditText>(R.id.emailShop).text.toString()
            val phone = view.findViewById<TextInputEditText>(R.id.phoneShop).text.toString()
            val postal = view.findViewById<TextInputEditText>(R.id.postalShop).text.toString()
            val theme = view.findViewById<TextInputEditText>(R.id.themeShop).text.toString()
            val society = view.findViewById<TextInputEditText>(R.id.society).text.toString()
            val poste = view.findViewById<TextInputEditText>(R.id.posteShop).text.toString()
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
                society,
                poste
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
        society: String,
        poste: String
    ) {
        shop.pseudo = pseudo
        shop.password = password
        shop.city = city
        shop.full_name = name
        shop.email = email
        shop.phone = phone
        shop.postal = postal
        shop.sujet = theme
        shop.society = society
        shop.fonction = poste
        val call = profilService.updateShopProfil(token, shop)
        call.enqueue(object : Callback<Boutique> {
            override fun onResponse(call: Call<Boutique>, response: Response<Boutique>) {
                if (response.isSuccessful) {
                    findNavController().navigate(R.id.shop_profil, null)
                    Log.i("Edit boutique", "OK")
                }
            }

            override fun onFailure(call: Call<Boutique>?, t: Throwable) {
                Log.e("Edit erreur:", t.message)
            }
        })
    }

    companion object {
        var shop = Boutique()
        var profilService = Constants.profilService
    }
}
