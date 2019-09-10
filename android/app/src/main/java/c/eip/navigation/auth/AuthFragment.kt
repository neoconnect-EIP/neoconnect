package c.eip.navigation.auth

import android.os.Bundle
import android.view.*
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.navOptions
import c.eip.R

class AuthFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        setHasOptionsMenu(true)
        return inflater.inflate(R.layout.auth_fragment, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val optionsInf = navOptions {
            anim {
                enter = R.anim.slide_in_right
                exit = R.anim.slide_out_left
                popEnter = R.anim.slide_in_left
                popExit = R.anim.slide_out_right
            }
        }
        val optionsShop = navOptions {
            anim {
                enter = R.anim.slide_in_left
                exit = R.anim.slide_out_right
                popEnter = R.anim.slide_in_right
                popExit = R.anim.slide_in_left
            }
        }
        view.findViewById<Button>(R.id.navigate_influenceur_auth)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_auth, null, optionsInf)
        }
        view.findViewById<Button>(R.id.navigate_shop_auth)?.setOnClickListener {
            findNavController().navigate(R.id.shop_auth, null, optionsShop)
        }
        view.findViewById<Button>(R.id.navigate_faq)?.setOnClickListener {
            findNavController().navigate(R.id.faq, null)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.main_menu, menu)
    }
}